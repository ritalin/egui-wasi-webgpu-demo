/// <reference types="@webgpu/types" />
import type { GpuFlagsConstant } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1365
export class GpuMapMode {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1369
  public _handle: GPUMapMode;
  public constructor(_handle: GPUMapMode) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1370
  static read(): GpuFlagsConstant {
    console.error("(Todo)", "GpuMapMode.read(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1371
  static write(): GpuFlagsConstant {
    console.error("(Todo)", "GpuMapMode.write(...)");
    return undefined as any;
  }
}
