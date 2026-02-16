import * as webgpu from "./recources/wasi-webgpu-webgpu/index.js";
import * as surface from "./recources/local-immediate-renderer-surface/index.js";
import * as graphics_context from "./recources/wasi-graphics-context-graphics-context/index.js";

export const getImportObject = function () {
  const obj: Record<string, any> = {};

  obj[`wasi:webgpu/webgpu`] = webgpu;
  obj[`wasi:graphics-context/graphics-context`] = graphics_context;
  obj[`local:immediate-renderer/surface`] = surface;

  return obj;
};
