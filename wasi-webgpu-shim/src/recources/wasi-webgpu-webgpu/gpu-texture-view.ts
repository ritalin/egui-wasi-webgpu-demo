/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1583
export class GpuTextureView {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1587
  public _handle: GPUTextureView;
  public constructor(_handle: GPUTextureView) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1588
  label(): string {
    console.error("(Todo)", "GpuTextureView.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1589
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuTextureView.setLabel(...)");
    return undefined as any;
  }
}
