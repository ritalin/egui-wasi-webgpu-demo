import "./style.css";
import { createWebGpuRuntime, WebGpuRuntime } from "webgpu-shim/host";
import { getImportObject } from "webgpu-shim/instantiation";
import { WASIShim } from "@bytecodealliance/preview2-shim/instantiation";
import { instantiate, type ImportObject, type Root } from "egui-renderer";
import type {
  Dispatcher,
  Event as DispatchEvent,
} from "pkg/_transpiled/interfaces/local-immediate-renderer-render";
import type { RenderContext } from "node_modules/webgpu-shim/src/types/local-immediate-renderer-surface";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>egui + wasi:webgpu example</h1>
    <div class="main">
      <canvas id="main-menu"></canvas>
      <dialog>
        <canvas id="sub-canvas1"></canvas>
      </dialog>
      <dialog>
        <canvas id="sub-canvas2"></canvas>
      </dialog>
    </div>
  </div>
`;

type Route = "route://app/main" | "route://app/polygon" | "route://app/counter";
type Command = "command://app/new-window" | "command://app/open-window";

class DomEventBridge {
  static findCanvas(route: Route): HTMLCanvasElement | undefined {
    let id;
    switch (route) {
      case "route://app/main": {
        id = "#main-menu";
        break;
      }
      case "route://app/polygon": {
        id = "#sub-canvas1";
        break;
      }
      case "route://app/counter": {
        id = "#sub-canvas2";
        break;
      }
    }

    const canvas = document.querySelector(id);
    if (canvas instanceof HTMLCanvasElement) {
      return canvas;
    }

    return undefined;
  }

  static bind(
    canvas: HTMLCanvasElement,
    callback: (events: DispatchEvent[]) => any,
  ) {
    canvas.addEventListener("click", (ev) => {
      const rect = canvas.getBoundingClientRect();
      callback([
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-down",
          val: "left",
        },
        {
          tag: "mouse-up",
          val: "left",
        },
      ]);
    });
  }

  static show(canvas: HTMLCanvasElement) {
    const dialog = canvas.parentElement as HTMLDialogElement;
    dialog.showModal();
  }
}

interface RouteEntry {
  surface: RenderContext;
  dispatcher: Dispatcher;
  events: DispatchEvent[];
}

class WasmEngine {
  runtime: WebGpuRuntime;
  instance: Root;
  dispatchers: Map<Route, RouteEntry> = new Map<Route, RouteEntry>();

  constructor(runtime: WebGpuRuntime, instance: Root) {
    this.runtime = runtime;
    this.instance = instance;
  }

  addEvent(route: Route, events: DispatchEvent[]) {
    this.dispatchers.get(route)?.events.push(...events);
  }

  launch(route: Route, canvas: HTMLCanvasElement): boolean {
    if (this.dispatchers.has(route)) return false;

    const surface = this.runtime.createRenderContext(canvas);

    let dispatcher;
    switch (route) {
      case "route://app/main": {
        dispatcher = this.instance.render.createMainRenderer(surface);
        break;
      }
      case "route://app/polygon": {
        dispatcher = this.instance.render.createTriangleRenderer(surface);
        break;
      }
      case "route://app/counter": {
        dispatcher = this.instance.render.createCounterRenderer(surface);
        break;
      }
      default: {
        return false;
      }
    }

    this.dispatchers.set(route, { surface, dispatcher, events: [] });

    return true;
  }

  dispatch(): { route: Route; command: Command }[] {
    const commands: { route: Route; command: Command }[] = [];
    const iter = this.dispatchers[Symbol.iterator]();

    for (const [_route, { dispatcher, events }] of iter) {
      dispatcher.pushEventAll(events.splice(0));
      const unhandled = dispatcher.dispatch();

      for (const ev of unhandled) {
        switch (ev.tag) {
          case "open-window": {
            commands.push({
              route: ev.val as Route,
              command: "command://app/open-window",
            });
          }
        }
      }
    }

    return commands;
  }
}

class AppLoop {
  engine: WasmEngine;

  constructor(engine: WasmEngine) {
    this.engine = engine;
  }

  run(route: Route) {
    this.handleCommands([{ route, command: "command://app/new-window" }]);
    this.engine.dispatch();
    this.frame();
  }

  addEvent(route: Route, events: DispatchEvent[]) {
    this.engine.addEvent(route, events);
  }

  handleCommands(commands: { route: Route; command: Command }[]) {
    for (const { route, command } of commands) {
      switch (command) {
        case "command://app/new-window": {
          const canvas = DomEventBridge.findCanvas(route);
          if (canvas === undefined) continue;

          if (this.engine.launch(route, canvas)) {
            DomEventBridge.bind(canvas, (events) =>
              this.addEvent(route, events),
            );
          }
          break;
        }
        case "command://app/open-window": {
          const canvas = DomEventBridge.findCanvas(route);
          if (canvas === undefined) continue;

          DomEventBridge.show(canvas);

          if (this.engine.launch(route, canvas)) {
            DomEventBridge.bind(canvas, (events) =>
              this.addEvent(route, events),
            );
          }
          break;
        }
      }
    }
  }

  frame() {
    const commands = this.engine.dispatch();
    this.handleCommands(commands);
    requestAnimationFrame(this.frame.bind(this));
  }
}

const imports = { ...getImportObject(), ...new WASIShim().getImportObject() };
const defaultLoader = undefined as unknown as (
  path: string,
) => Promise<WebAssembly.Module>;

const instance = await instantiate(
  defaultLoader,
  imports as unknown as ImportObject,
);

const runtime = await createWebGpuRuntime();
const engine = new WasmEngine(runtime, instance);
const app = new AppLoop(engine);
app.run("route://app/main");
