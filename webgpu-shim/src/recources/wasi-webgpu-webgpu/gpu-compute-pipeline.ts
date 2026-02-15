/// <reference types="@webgpu/types" />
import { GpuBindGroupLayout } from "./gpu-bind-group-layout.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1304
export class GpuComputePipeline {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1308
  public _handle: GPUComputePipeline;
  public constructor(_handle: GPUComputePipeline) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1309
  label(): string {
    console.error("(Todo)", "GpuComputePipeline.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1310
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuComputePipeline.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1311
  getBindGroupLayout(__index: number): GpuBindGroupLayout {
    console.error("(Todo)", "GpuComputePipeline.getBindGroupLayout(...)");
    return undefined as any;
  }
}
