/** @module Interface local:immediate-renderer/surface **/
export type GpuDevice = import('./wasi-webgpu-webgpu.js').GpuDevice;
export type GpuCanvasContext = import('./wasi-webgpu-webgpu.js').GpuCanvasContext;
export type GpuRenderPipeline = import('./wasi-webgpu-webgpu.js').GpuRenderPipeline;
export type GpuBindGroupLayout = import('./wasi-webgpu-webgpu.js').GpuBindGroupLayout;
export interface FrameSize {
  width: number,
  height: number,
}

export class RenderContext {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  size(): FrameSize;
  scaleFactor(): number;
  requestSetSize(size: FrameSize): void;
  getDevice(): GpuDevice;
  getCanvas(): GpuCanvasContext;
  getPipeline(): GpuRenderPipeline;
  getUniformLayout(): GpuBindGroupLayout;
  getTextureLayout(): GpuBindGroupLayout;
}
