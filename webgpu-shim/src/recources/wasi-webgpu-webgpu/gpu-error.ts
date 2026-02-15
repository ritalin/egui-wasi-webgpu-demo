/// <reference types="@webgpu/types" />
import type { GpuErrorKind } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1356
export class GpuError {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1360
  public _handle: GPUError;
  public constructor(_handle: GPUError) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1361
  message(): string {
    console.error("(Todo)", "GpuError.message(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1362
  kind(): GpuErrorKind {
    console.error("(Todo)", "GpuError.kind(...)");
    return undefined as any;
  }
}
