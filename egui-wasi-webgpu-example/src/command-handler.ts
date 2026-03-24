import type {
  ChangeSpec,
  ClipboardData,
  Command,
  CursorStyle,
} from "pkg/interfaces/local-immediate-renderer-example-interaction";
import type { WasmEngine } from "./engine";
import { DomEventBridge } from "./event-bridge";

export type Route = "route://app/main";
export type HostCommand =
  | { tag: "command://app/new-window" }
  | { tag: "command://app/open-window" }
  | { tag: "command://app/load-image"; paths: string[] }
  | { tag: "command://app/write-clipboard"; data: ClipboardData };

export type AppEffect = "effect://app/image-data";

export function queueCommand(engine: WasmEngine, route: Route, commands: Command[]) {
  for (const cmd of commands) {
    switch (cmd.tag) {
      case "open-window": {
        setTimeout(
          async () => await handleHostCommand(engine, cmd.val as Route, { tag: "command://app/open-window" }),
          0,
        );
        break;
      }
      case "request-image": {
        setTimeout(
          async () => await handleHostCommand(engine, route, { tag: "command://app/load-image", paths: cmd.val }),
          0,
        );
        break;
      }
      case "cursor": {
        changeCursor(route, cmd.val);
        break;
      }
      case "clipboard": {
        setTimeout(
          async () => await handleHostCommand(engine, route, { tag: "command://app/write-clipboard", data: cmd.val }),
        );
        break;
      }
      case "change-set": {
        updateEditContext(engine, route, cmd.val);
        break;
      }
    }
  }
}

export async function handleHostCommand(engine: WasmEngine, route: Route, cmd: HostCommand): Promise<void> {
  switch (cmd.tag) {
    case "command://app/new-window": {
      const canvas = DomEventBridge.findCanvas(route);
      if (canvas === undefined) {
        return Promise.reject(`Canvas of the route is not found: (${route})`);
      }

      const { editHost, editContext } = createEditHost(canvas);
      editHost.focus();

      if (engine.launch(route, canvas, editContext)) {
        engine.addEvent(route, [{ tag: "activate" }]);
        DomEventBridge.bind(canvas, editHost, (events) => engine.addEvent(route, events));
      }
      break;
    }
    case "command://app/open-window": {
      const canvas = DomEventBridge.findCanvas(route);
      if (canvas === undefined) {
        return Promise.reject(`Canvas of the route is not found: (${route})`);
      }

      const { editHost, editContext } = createEditHost(canvas);

      DomEventBridge.show(canvas);

      if (engine.launch(route, canvas, editContext)) {
        DomEventBridge.bind(canvas, editHost, (events) => engine.addEvent(route, events));
      }
      break;
    }
    case "command://app/load-image": {
      cmd.paths.forEach((path) => {
        const url = new URL(
          `${import.meta.env.BASE_URL}${path.startsWith("/") ? path.slice(1) : path}`,
          window.location.origin,
        );
        fetch(url)
          .then(async (res) => {
            if (!res.ok) {
              return Promise.reject(`Image is not found: "${url}"`);
            }
            const buffer = await res.bytes();
            console.log("image-data/len", buffer.byteLength);
            engine.addEffects(route, [{ tag: "image-data", val: { source: path, bytes: buffer } }]);
          })
          .catch((err) => console.error(err));
      });
      break;
    }
    case "command://app/write-clipboard": {
      switch (cmd.data.tag) {
        case "text":
          console.info(`clipboard/write: ${cmd.data.val}`);
          await window.navigator.clipboard.writeText(cmd.data.val);
          break;
      }
      break;
    }
  }
}

function changeCursor(route: Route, cursorStyle: CursorStyle) {
  const canvas = DomEventBridge.findCanvas(route);
  if (!canvas) return;

  canvas.style.cursor = cursorStyle;
}

function createEditHost(canvas: HTMLElement): { editHost: HTMLElement; editContext: EditContext } {
  const editContext = new EditContext();
  canvas.contentEditable = "true";
  canvas.tabIndex = 0;

  canvas.editContext = editContext;

  return { editHost: canvas, editContext };
}

function updateEditContext(engine: WasmEngine, route: Route, changeSpecs: ChangeSpec[]) {
  const entry = engine.entry(route);
  if (!entry) return;

  for (const c of changeSpecs.reverse()) {
    entry.canvas.editContext = entry.editContext;
    entry.canvas.editContext.updateText(c.offset, c.offset + c.len, c.newValue);
    console.debug(`Active edit changed/current: "${entry.canvas.editContext.text}"`);
  }
}
