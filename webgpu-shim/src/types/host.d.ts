import { type RenderContext } from "./index";

export class WebGpuRuntime {
  private device: GPUDevice;
  constructor(device: GPUDevice);
  createRenderContext(canvas: HTMLCanvasElement): RenderContext;
}

export declare const createWebGpuRuntime: () => Promise<WebGpuRuntime>;
