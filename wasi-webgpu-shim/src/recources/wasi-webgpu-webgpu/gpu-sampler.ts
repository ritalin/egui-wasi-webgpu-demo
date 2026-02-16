/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1476
export class GpuSampler {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1480
  public _handle: GPUSampler;
  public constructor(_handle: GPUSampler) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1481
  label(): string {
    console.error("(Todo)", "GpuSampler.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1482
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuSampler.setLabel(...)");
    return undefined as any;
  }
}
