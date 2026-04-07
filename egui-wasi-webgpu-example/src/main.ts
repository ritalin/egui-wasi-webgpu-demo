import "./style.css";
import { createWebGpuRuntime } from "wasi-webgpu-runtime/host";
import { getImportObject } from "wasi-webgpu-runtime/instantiation";
import { WASIShim } from "@bytecodealliance/preview2-shim/instantiation";
import { instantiate, type ImportObject } from "pkg/egui-renderer";
import { WasmEngine } from "./engine";
import { type Route, handleHostCommand } from "./command-handler";
import type { Event as DispatchEvent } from "./types/event/interfaces/local-immediate-renderer-types";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>egui + wasi:webgpu example</h1>
    <div class="main">
      <canvas id="main-window"></canvas>
    </div>
`;

class AppLoop {
  engine: WasmEngine;

  constructor(engine: WasmEngine) {
    this.engine = engine;
  }

  async run(route: Route) {
    await handleHostCommand(this.engine, route, { tag: "command://app/new-window" });
    this.engine.dispatch();
    this.frame();
  }

  addEvent(route: Route, events: DispatchEvent[]) {
    this.engine.addEvent(route, events);
  }

  frame() {
    this.engine.dispatch();
    requestAnimationFrame(this.frame.bind(this));
  }
}

const imports = { ...getImportObject(), ...new WASIShim().getImportObject() };
const defaultLoader = undefined as unknown as (path: string) => Promise<WebAssembly.Module>;

try {
  const instance = await instantiate(defaultLoader, imports as unknown as ImportObject);

  const runtime = await createWebGpuRuntime();
  const engine = await WasmEngine.create(runtime, instance);
  const app = new AppLoop(engine);
  await app.run("route://app/main");
} catch (err) {
  console.error(err);
  console.error("Application terminated unexpectedly.");
}
