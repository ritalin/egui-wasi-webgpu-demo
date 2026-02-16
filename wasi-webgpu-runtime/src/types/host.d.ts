import type {
  RenderContext,
  FrameSize,
} from "./local-immediate-renderer-surface.js";

export { type RenderContext, FrameSize };

export class WebGpuRuntime {
  private device: GPUDevice;
  constructor(device: GPUDevice);
  createRenderContext(canvas: HTMLCanvasElement): RenderContext;
}

export declare const createWebGpuRuntime: () => Promise<WebGpuRuntime>;
