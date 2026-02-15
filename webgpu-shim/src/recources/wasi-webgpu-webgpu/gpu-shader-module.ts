/// <reference types="@webgpu/types" />
import { GpuCompilationInfo } from "./gpu-compilation-info.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1485
export class GpuShaderModule {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1489
  public _handle: GPUShaderModule;
  public constructor(_handle: GPUShaderModule) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1490
  getCompilationInfo(): GpuCompilationInfo {
    console.error("(Todo)", "GpuShaderModule.getCompilationInfo(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1491
  label(): string {
    console.error("(Todo)", "GpuShaderModule.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1492
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuShaderModule.setLabel(...)");
    return undefined as any;
  }
}
