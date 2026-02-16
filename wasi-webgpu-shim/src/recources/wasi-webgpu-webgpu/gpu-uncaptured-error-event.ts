/// <reference types="@webgpu/types" />
import { GpuError } from "./gpu-error.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1592
export class GpuUncapturedErrorEvent {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1596
  public _handle: GPUUncapturedErrorEvent;
  public constructor(_handle: GPUUncapturedErrorEvent) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1597
  error(): GpuError {
    console.error("(Todo)", "GpuUncapturedErrorEvent.error(...)");
    return undefined as any;
  }
}
