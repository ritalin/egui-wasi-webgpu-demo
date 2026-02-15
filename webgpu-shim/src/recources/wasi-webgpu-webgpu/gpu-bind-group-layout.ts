/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1170
export class GpuBindGroupLayout {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1174
  public _handle: GPUBindGroupLayout;
  public constructor(_handle: GPUBindGroupLayout) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1175
  label(): string {
    console.error("(Todo)", "GpuBindGroupLayout.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1176
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuBindGroupLayout.setLabel(...)");
    return undefined as any;
  }
}
