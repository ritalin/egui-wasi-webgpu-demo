import type { Root } from "pkg/egui-renderer";
import type {
  Dispatcher,
  Effect,
  RenderContext,
  Event as DispatchEvent,
} from "pkg/interfaces/local-immediate-renderer-example-render";

import type { WebGpuRuntime } from "wasi-webgpu-runtime/host";
import { queueCommand, type Route } from "./command-handler";

export interface RouteEntry {
  editContext: EditContext;
  surface: RenderContext;
  dispatcher: Dispatcher;
  events: DispatchEvent[];
  effects: Effect[];
}

export class WasmEngine {
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

  addEffects(route: Route, effects: Effect[]) {
    this.dispatchers.get(route)?.effects.push(...effects);
  }
  launch(route: Route, canvas: HTMLCanvasElement, editContext: EditContext): boolean {
    if (this.dispatchers.has(route)) return false;

    const surface = this.runtime.createRenderContext(canvas) as unknown as RenderContext;

    let dispatcher;
    switch (route) {
      case "route://app/main": {
        dispatcher = this.instance.render.createRenderer(surface);
        break;
      }
      default: {
        return false;
      }
    }

    this.dispatchers.set(route, { editContext, surface, dispatcher, events: [], effects: [] });

    return true;
  }

  dispatch() {
    const iter = this.dispatchers[Symbol.iterator]();

    for (const [route, { dispatcher, events, effects }] of iter) {
      if (events.length > 0 || effects.length > 0) {
        dispatcher.eventChannel().post(events.splice(0));
        dispatcher.commandChannel().post(effects.splice(0));
      }
      const [unhandled, commands] = dispatcher.dispatch();

      queueCommand(this, route, commands);
    }
  }
}
