/// <reference types="@webgpu/types" />
import type { GpuFlagsConstant } from "../../types/wasi-webgpu-webgpu.js";

// origin: src/types/wasi-webgpu-webgpu.d.ts:1571
export class GpuTextureUsage {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1575
  public _handle: GPUTextureUsage;
  public constructor(_handle: GPUTextureUsage) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1576
  static copySrc(): GpuFlagsConstant {
    return GPUTextureUsage.COPY_SRC;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1577
  static copyDst(): GpuFlagsConstant {
    return GPUTextureUsage.COPY_DST;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1578
  static textureBinding(): GpuFlagsConstant {
    return GPUTextureUsage.TEXTURE_BINDING;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1579
  static storageBinding(): GpuFlagsConstant {
    return GPUTextureUsage.STORAGE_BINDING;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1580
  static renderAttachment(): GpuFlagsConstant {
    return GPUTextureUsage.TRANSIENT_ATTACHMENT;
  }
}
