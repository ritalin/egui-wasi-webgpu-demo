/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1408
export class GpuRenderBundle {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1412
  public _handle: GPURenderBundle;
  public constructor(_handle: GPURenderBundle) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1413
  label(): string {
    console.error("(Todo)", "GpuRenderBundle.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1414
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuRenderBundle.setLabel(...)");
    return undefined as any;
  }
}
