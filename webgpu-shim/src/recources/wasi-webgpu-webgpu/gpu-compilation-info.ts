/// <reference types="@webgpu/types" />
import { GpuCompilationMessage } from "./gpu-compilation-message.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1266
export class GpuCompilationInfo {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1270
  public _handle: GPUCompilationInfo;
  public constructor(_handle: GPUCompilationInfo) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1271
  messages(): Array<GpuCompilationMessage> {
    console.error("(Todo)", "GpuCompilationInfo.messages(...)");
    return undefined as any;
  }
}
