import type { Command } from "pkg/interfaces/local-immediate-renderer-example-interaction";
import type { WasmEngine } from "./engine";
import { DomEventBridge } from "./event-bridge";

export type Route = "route://app/main";
export type HostCommand =
  | { tag: "command://app/new-window" }
  | { tag: "command://app/open-window" }
  | { tag: "command://app/load-image"; url: string };

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
          async () => await handleHostCommand(engine, route, { tag: "command://app/load-image", url: cmd.val }),
          0,
        );
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
      const url = new URL(
        `${import.meta.env.BASE_URL}${cmd.url.startsWith("/") ? cmd.url.slice(1) : cmd.url}`,
        window.location.origin,
      );

      const res = await fetch(url);
      const buffer = await res.bytes();
      console.log("image-data/len", buffer.byteLength);
      engine.addEffects(route, [{ tag: "image-data", val: { source: cmd.url, bytes: buffer } }]);
      break;
    }
  }
}
