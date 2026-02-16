/// <reference types="@webgpu/types" />
import { GpuBindGroupLayout } from "./gpu-bind-group-layout.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1466
export class GpuRenderPipeline {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1470
  public _handle: GPURenderPipeline;
  public constructor(_handle: GPURenderPipeline) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1471
  label(): string {
    console.error("(Todo)", "GpuRenderPipeline.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1472
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuRenderPipeline.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1473
  getBindGroupLayout(__index: number): GpuBindGroupLayout {
    console.error("(Todo)", "GpuRenderPipeline.getBindGroupLayout(...)");
    return undefined as any;
  }
}
