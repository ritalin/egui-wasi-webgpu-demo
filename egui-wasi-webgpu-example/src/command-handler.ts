import type { ClipboardData, Command, CursorStyle } from "pkg/interfaces/local-immediate-renderer-example-interaction";
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

      if (engine.launch(route, canvas)) {
        DomEventBridge.bind(canvas, (events) => engine.addEvent(route, events));
      }
      break;
    }
    case "command://app/open-window": {
      const canvas = DomEventBridge.findCanvas(route);
      if (canvas === undefined) {
        return Promise.reject(`Canvas of the route is not found: (${route})`);
      }

      DomEventBridge.show(canvas);

      if (engine.launch(route, canvas)) {
        DomEventBridge.bind(canvas, (events) => engine.addEvent(route, events));
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
