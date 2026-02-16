/// <reference types="@webgpu/types" />
import type { GpuFlagsConstant } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1495
export class GpuShaderStage {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1499
  public _handle: GPUShaderStage;
  public constructor(_handle: GPUShaderStage) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1500
  static vertex(): GpuFlagsConstant {
    console.error("(Todo)", "GpuShaderStage.vertex(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1501
  static fragment(): GpuFlagsConstant {
    console.error("(Todo)", "GpuShaderStage.fragment(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1502
  static compute(): GpuFlagsConstant {
    console.error("(Todo)", "GpuShaderStage.compute(...)");
    return undefined as any;
  }
}
