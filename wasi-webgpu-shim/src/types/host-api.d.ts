export { TextureFormat } from "../supports/enum-conv.js";
export { computeWgpuLayout, WGpuType } from "./supports/compute-size.js";

import {
  GpuDevice as PublicGpuDevice,
  GpuBindGroupLayout as PublicGpuBindGroupLayout,
  GpuRenderPipeline as PublicGpuRenderPipeline,
  GpuCanvasContext as PublicGpuCanvasContext,
} from "./recources/wasi-webgpu-webgpu/index.js";

export class GpuDevice extends PublicGpuDevice {
  constructor(_handle: GPUDevice);
}

export class GpuBindGroupLayout extends PublicGpuBindGroupLayout {
  constructor(_handle: GPUBindGroupLayout);
}

export class GpuRenderPipeline extends PublicGpuRenderPipeline {
  constructor(_handle: GPURenderPipeline);
}

export class GpuCanvasContext extends PublicGpuCanvasContext {
  constructor(_handle: GPUCanvasContext);
  configure(configuration: GpuCanvasConfiguration): void;
}
