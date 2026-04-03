import type {
  Dispatcher,
  Effect,
  RenderContext,
  Event as DispatchEvent,
} from "./types/dispatcher/interfaces/local-immediate-renderer-example-render";
import type { ExampleWorld as Root } from "./types/dispatcher/example-world";

import type { WebGpuRuntime } from "wasi-webgpu-runtime/host";
import { queueCommand, type Route } from "./command-handler";
import type { EditEventSource } from "./edit-event-source";

export class RouteEntry {
  eventSource: EditEventSource;
  surface: RenderContext;
  dispatcher: Dispatcher;
  events: DispatchEvent[];
  effects: Effect[];

  constructor(eventSource: EditEventSource, surface: RenderContext, dispatcher: Dispatcher, effects: Effect[]) {
    this.eventSource = eventSource;
    this.surface = surface;
    this.dispatcher = dispatcher;
    this.events = [];
    this.effects = effects;
  }
}

const DEFAULT_FONT_NAME = "NotoSansJP-Regular";
const DEFAULT_FONT_PATH = `/assets/${DEFAULT_FONT_NAME}.otf`;

export class WasmEngine {
  runtime: WebGpuRuntime;
  instance: Root;
  dispatchers: Map<Route, RouteEntry> = new Map<Route, RouteEntry>();
  font?: Uint8Array<ArrayBuffer>;

  static async create(runtime: WebGpuRuntime, instance: Root): Promise<WasmEngine> {
    const font = await loadFont(DEFAULT_FONT_PATH);
    return new WasmEngine(runtime, instance, font);
  }

  private constructor(runtime: WebGpuRuntime, instance: Root, font?: Uint8Array<ArrayBuffer>) {
    this.runtime = runtime;
    this.instance = instance;
    this.font = font;
  }

  addEvent(route: Route, events: DispatchEvent[]) {
    this.dispatchers.get(route)?.events.push(...events);
  }

  addEffects(route: Route, effects: Effect[]) {
    this.dispatchers.get(route)?.effects.push(...effects);
  }

  launch(route: Route, canvas: HTMLCanvasElement, eventSource: EditEventSource): boolean {
    if (this.dispatchers.has(route)) return false;

    const surface = this.runtime.createRenderContext(canvas);

    let dispatcher;
    const effects: Effect[] = [];
    switch (route) {
      case "route://app/main": {
        dispatcher = this.instance.render.createRenderer(surface);
        if (this.font) {
          effects.push({
            tag: "font-data",
            val: { source: DEFAULT_FONT_PATH, name: DEFAULT_FONT_NAME, bytes: this.font },
          });
        }
        break;
      }
      default: {
        return false;
      }
    }

    this.dispatchers.set(route, new RouteEntry(eventSource, surface, dispatcher, effects));

    return true;
  }

  entry(route: Route): RouteEntry | undefined {
    return this.dispatchers.get(route);
  }

  removeRoute(route: Route) {
    const entry = this.entry(route);
    if (entry) {
      this.dispatchers.delete(route);
      entry.eventSource.editHost.remove();
      console.log(`Route: ${route} is closed`);
    }
  }

  dispatch() {
    const iter = this.dispatchers[Symbol.iterator]();

    for (const [route, { dispatcher, events, effects }] of iter) {
      if (events.length > 0 || effects.length > 0) {
        dispatcher.eventChannel().post(events.splice(0));
        dispatcher.commandChannel().post(effects.splice(0));
      }
      const [_unhandled, commands] = dispatcher.dispatch();

      queueCommand(this, route, commands);
    }
  }
}
async function loadFont(path: string): Promise<Uint8Array<ArrayBuffer> | undefined> {
  const url = new URL(
    `${import.meta.env.BASE_URL}${path.startsWith("/") ? path.slice(1) : path}`,
    window.location.origin,
  );

  return fetch(url).then(async (res) => {
    if (!res.ok) {
      console.error(`Font is not fount:  "${url}"`);
      return;
    }
    const buffer = await res.bytes();
    console.log("font-data/len", buffer.byteLength);

    return buffer;
  });
}
