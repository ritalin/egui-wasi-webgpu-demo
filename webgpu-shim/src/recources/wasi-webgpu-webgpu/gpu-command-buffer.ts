/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1236
export class GpuCommandBuffer {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1240
  public _handle: GPUCommandBuffer;
  public constructor(_handle: GPUCommandBuffer) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1241
  label(): string {
    console.error("(Todo)", "GpuCommandBuffer.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1242
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuCommandBuffer.setLabel(...)");
    return undefined as any;
  }
}
