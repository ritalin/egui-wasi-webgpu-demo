/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1374
export class GpuPipelineLayout {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1378
  public _handle: GPUPipelineLayout;
  public constructor(_handle: GPUPipelineLayout) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1379
  label(): string {
    console.error("(Todo)", "GpuPipelineLayout.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1380
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuPipelineLayout.setLabel(...)");
    return undefined as any;
  }
}
