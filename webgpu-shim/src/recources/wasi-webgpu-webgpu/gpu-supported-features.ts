/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1505
export class GpuSupportedFeatures {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1509
  public _handle: GPUSupportedFeatures;
  public constructor(_handle: GPUSupportedFeatures) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1510
  has(__value: string): boolean {
    console.error("(Todo)", "GpuSupportedFeatures.has(...)");
    return undefined as any;
  }
}
