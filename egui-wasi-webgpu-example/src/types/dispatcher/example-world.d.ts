// world local:immediate-renderer-example/example-world
import type * as LocalImmediateRendererExampleInteraction from './interfaces/local-immediate-renderer-example-interaction.js'; // local:immediate-renderer-example/interaction
import type * as LocalImmediateRendererTypes from './interfaces/local-immediate-renderer-types.js'; // local:immediate-renderer/types
import type * as LocalWebgpuRuntimeSurface from './interfaces/local-webgpu-runtime-surface.js'; // local:webgpu-runtime/surface
import type * as WasiGraphicsContextGraphicsContext from './interfaces/wasi-graphics-context-graphics-context.js'; // wasi:graphics-context/graphics-context@0.0.1
import type * as WasiIoPoll from './interfaces/wasi-io-poll.js'; // wasi:io/poll@0.2.9
import type * as WasiWebgpuWebgpu from './interfaces/wasi-webgpu-webgpu.js'; // wasi:webgpu/webgpu@0.0.1
import type * as LocalImmediateRendererExampleRender from './interfaces/local-immediate-renderer-example-render.js'; // local:immediate-renderer-example/render
export interface ImportObject {
  'local:immediate-renderer-example/interaction': typeof LocalImmediateRendererExampleInteraction,
  'local:immediate-renderer/types': typeof LocalImmediateRendererTypes,
  'local:webgpu-runtime/surface': typeof LocalWebgpuRuntimeSurface,
  'wasi:graphics-context/graphics-context@0.0.1': typeof WasiGraphicsContextGraphicsContext,
  'wasi:io/poll@0.2.9': typeof WasiIoPoll,
  'wasi:webgpu/webgpu@0.0.1': typeof WasiWebgpuWebgpu,
}
export interface ExampleWorld {
  'local:immediate-renderer-example/render': typeof LocalImmediateRendererExampleRender,
  render: typeof LocalImmediateRendererExampleRender,
}

/**
* Instantiates this component with the provided imports and
* returns a map of all the exports of the component.
*
* This function is intended to be similar to the
* `WebAssembly.instantiate` function. The second `imports`
* argument is the "import object" for wasm, except here it
* uses component-model-layer types instead of core wasm
* integers/numbers/etc.
*
* The first argument to this function, `getCoreModule`, is
* used to compile core wasm modules within the component.
* Components are composed of core wasm modules and this callback
* will be invoked per core wasm module. The caller of this
* function is responsible for reading the core wasm module
* identified by `path` and returning its compiled
* `WebAssembly.Module` object. This would use `compileStreaming`
* on the web, for example.
*/
export function instantiate(
getCoreModule: (path: string) => WebAssembly.Module,
imports: ImportObject,
instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => WebAssembly.Instance
): ExampleWorld;
export function instantiate(
getCoreModule: (path: string) => WebAssembly.Module | Promise<WebAssembly.Module>,
imports: ImportObject,
instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => WebAssembly.Instance | Promise<WebAssembly.Instance>
): ExampleWorld | Promise<ExampleWorld>;

