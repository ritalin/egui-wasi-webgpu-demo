/// <reference types="@webgpu/types" />
import type { GpuFlagsConstant } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1224
export class GpuColorWrite {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1228
  public _handle: GPUColorWrite;
  public constructor(_handle: GPUColorWrite) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1229
  static red(): GpuFlagsConstant {
    console.error("(Todo)", "GpuColorWrite.red(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1230
  static green(): GpuFlagsConstant {
    console.error("(Todo)", "GpuColorWrite.green(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1231
  static blue(): GpuFlagsConstant {
    console.error("(Todo)", "GpuColorWrite.blue(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1232
  static alpha(): GpuFlagsConstant {
    console.error("(Todo)", "GpuColorWrite.alpha(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1233
  static all(): GpuFlagsConstant {
    console.error("(Todo)", "GpuColorWrite.all(...)");
    return undefined as any;
  }
}
