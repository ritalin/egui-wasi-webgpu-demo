import { webgpu, graphics_context } from "wasi-webgpu-shim";
import * as surface from "./resources/local-immediate-renderer-surface/index.js";

export const getImportObject = function () {
  const obj: Record<string, any> = {};

  obj[`wasi:webgpu/webgpu`] = webgpu;
  obj[`wasi:graphics-context/graphics-context`] = graphics_context;
  obj[`local:webgpu-runtime/surface`] = surface;

  return obj;
};
