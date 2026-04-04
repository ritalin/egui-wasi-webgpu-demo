import type {
  ChangeSpec,
  ClipboardData,
  Command,
  CompositionBounds,
  CursorStyle,
  Destination,
} from "./types/interaction/interfaces/local-immediate-renderer-example-interaction";
import type { RouteEntry, WasmEngine } from "./engine";
import { DomEventBridge } from "./event-bridge";
import { EditEventSource } from "./edit-event-source";

export type Route = "route://app/main";
export type HostCommand =
  | { tag: "command://app/new-window" }
  | { tag: "command://app/open-window" }
  | { tag: "command://app/close-window"; withQuery: boolean }
  | { tag: "command://app/load-image"; paths: string[] }
  | { tag: "command://app/write-clipboard"; data: ClipboardData }
  | { tag: "command://app/screenshot"; dests: Destination[] };

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
      case "close-window": {
        setTimeout(
          async () =>
            await handleHostCommand(engine, route, {
              tag: "command://app/close-window",
              withQuery: cmd.val.withQuery ?? false,
            }),
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
      case "open-url": {
        setTimeout(async () => {
          handleHostCommand(engine, route, {
            tag: "command://app/write-clipboard",
            data: { tag: "text", val: cmd.val[0] },
          });
          showToast(`Copied URL to the clipboard: ${cmd.val[0]}`);
        }, 0);
        break;
      }
      case "change-set": {
        updateEditContext(engine, route, cmd.val);
        break;
      }
      case "composition-bounds": {
        updateCompositionBounds(engine, route, cmd.val);
        break;
      }
      case "screenshot": {
        setTimeout(
          async () => await handleHostCommand(engine, route, { tag: "command://app/screenshot", dests: cmd.val }),
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

      const eventSource = new EditEventSource(canvas);
      eventSource.editHost.focus();

      if (engine.launch(route, canvas, eventSource)) {
        engine.addEvent(route, [{ tag: "activate" }]);
        DomEventBridge.bind(eventSource, (events) => engine.addEvent(route, events));
      }
      break;
    }
    case "command://app/open-window": {
      const canvas = DomEventBridge.findCanvas(route);
      if (canvas === undefined) {
        return Promise.reject(`Canvas of the route is not found: (${route})`);
      }

      const eventSource = new EditEventSource(canvas);

      DomEventBridge.show(canvas);

      if (engine.launch(route, canvas, eventSource)) {
        DomEventBridge.bind(eventSource, (events) => engine.addEvent(route, events));
      }
      break;
    }
    case "command://app/close-window": {
      if (cmd.withQuery) {
        engine.entry(route)?.effects.push({ tag: "request-close-query" });
      } else {
        engine.removeRoute(route);
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
    case "command://app/screenshot": {
      console.log("Screenshot requested");
      const entry = engine.entry(route);
      if (entry) {
        takeScreenShot(engine, entry, cmd.dests);
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

function updateEditContext(engine: WasmEngine, route: Route, changeSpecs: ChangeSpec[]) {
  const entry = engine.entry(route);
  if (!entry) return;

  entry.eventSource.restoreEditMode();

  console.log("change-spec", `len: ${changeSpecs.length}`, `prev-state: ${entry.eventSource.text}`);

  for (const c of changeSpecs.reverse()) {
    console.debug("ChangeSpec", c.offset, c.len, c.newValue);
    entry.eventSource.updateText(c.offset, c.offset + c.len, c.newValue!);
    console.debug(`Active edit changed/current: "${entry.eventSource.text}"`);
  }
}

function updateCompositionBounds(engine: WasmEngine, route: Route, bounds: CompositionBounds) {
  const entry = engine.entry(route);
  if (!entry) return;

  entry.eventSource.restoreEditMode();
  entry.eventSource.updateCompositionBounds(bounds);
  entry.events.push({ tag: "keep-focus" });
}

function showToast(message: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2500);
}

function takeScreenShot(engine: WasmEngine, entry: RouteEntry, dests: Destination[]) {
  entry.eventSource.editHost.toBlob(async (data) => {
    if (!data) {
      console.error("Screenshot failed");
      return;
    }
    console.log("Screenshot created", `size: ${data.size}`, `type: ${data.type}`);

    for (const d of dests) {
      switch (d.tag) {
        case "origin": {
          console.log("screenshot", "Send to origin");
          entry.effects.push({ tag: "image-data", val: { source: "", bytes: await data.bytes() } });
          break;
        }
        case "route": {
          const other = engine.entry(d.val as Route);
          if (other) {
            other.effects.push({ tag: "image-data", val: { source: "", bytes: await data.bytes() } });
          }
          break;
        }
        case "clipboard": {
          window.navigator.clipboard.write([new ClipboardItem({ [data.type]: data })]);
          showToast("Copy screenshot to clipboard");
          break;
        }
      }
    }
  });
}
