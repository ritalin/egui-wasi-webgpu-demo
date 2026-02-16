import {
  GpuDevice,
  GpuRenderPipeline,
  GpuBindGroupLayout,
  GpuCanvasContext,
} from "wasi-webgpu-shim/host-api";
import type { FrameSize } from "../../types/local-immediate-renderer-surface.js";
import type { RenderContextPeer } from "../../peers/surface.js";
// origin: src/types/local-immediate-renderer-surface.d.ts:11
export class RenderContext {
  private readonly _handle: RenderContextPeer;
  // origin: src/types/local-immediate-renderer-surface.d.ts:15
  public constructor(_handle: RenderContextPeer) {
    this._handle = _handle;
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:16
  size(): FrameSize {
    const canvas = this._handle.canvas as HTMLCanvasElement;
    return { width: canvas.width, height: canvas.height };
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:17
  scaleFactor(): number {
    return window.devicePixelRatio;
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:18
  requestSetSize(size: FrameSize): void {
    const canvas = this._handle.canvas as HTMLCanvasElement;
    canvas.width = size.width;
    canvas.height = size.height;
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:19
  getDevice(): GpuDevice {
    return new GpuDevice(this._handle.device as GPUDevice);
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:20
  getCanvas(): GpuCanvasContext {
    return new GpuCanvasContext(this._handle.context);
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:21
  getPipeline(): GpuRenderPipeline {
    return new GpuRenderPipeline(this._handle.pipeline);
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:22
  getUniformLayout(): GpuBindGroupLayout {
    return new GpuBindGroupLayout(this._handle.uniformLayout);
  }
  // origin: src/types/local-immediate-renderer-surface.d.ts:23
  getTextureLayout(): GpuBindGroupLayout {
    return new GpuBindGroupLayout(this._handle.textureLayout);
  }
}
