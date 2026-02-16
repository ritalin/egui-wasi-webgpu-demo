/// <reference types="@webgpu/types" />
// origin: src/types/wasi-webgpu-webgpu.d.ts:1148
export class GpuAdapterInfo {
  public _handle: GPUAdapterInfo;
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1152
  public constructor(_handle: GPUAdapterInfo) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1153
  vendor(): string {
    console.error("(Todo)", "GpuAdapterInfo.vendor(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1154
  architecture(): string {
    console.error("(Todo)", "GpuAdapterInfo.architecture(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1155
  device(): string {
    console.error("(Todo)", "GpuAdapterInfo.device(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1156
  description(): string {
    console.error("(Todo)", "GpuAdapterInfo.description(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1157
  subgroupMinSize(): number {
    console.error("(Todo)", "GpuAdapterInfo.subgroupMinSize(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1158
  subgroupMaxSize(): number {
    console.error("(Todo)", "GpuAdapterInfo.subgroupMaxSize(...)");
    return undefined as any;
  }
}
