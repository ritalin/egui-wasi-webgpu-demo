/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1161
export class GpuBindGroup {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1165
  public _handle: GPUBindGroup;
  public constructor(_handle: GPUBindGroup) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1166
  label(): string {
    console.error("(Todo)", "GpuBindGroup.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1167
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuBindGroup.setLabel(...)");
    return undefined as any;
  }
}
