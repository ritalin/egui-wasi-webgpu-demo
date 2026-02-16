/// <reference types="@webgpu/types" />
import type { GpuDeviceLostReason } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1347
export class GpuDeviceLostInfo {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1351
  public _handle: GPUDeviceLostInfo;
  public constructor(_handle: GPUDeviceLostInfo) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1352
  reason(): GpuDeviceLostReason {
    console.error("(Todo)", "GpuDeviceLostInfo.reason(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1353
  message(): string {
    console.error("(Todo)", "GpuDeviceLostInfo.message(...)");
    return undefined as any;
  }
}
