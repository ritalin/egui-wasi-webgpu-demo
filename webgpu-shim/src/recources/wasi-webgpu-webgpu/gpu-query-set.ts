/// <reference types="@webgpu/types" />
import type {
  GpuQueryType,
  GpuSize32Out,
} from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1383
export class GpuQuerySet {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1387
  public _handle: GPUQuerySet;
  public constructor(_handle: GPUQuerySet) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1388
  destroy(): void {
    console.error("(Todo)", "GpuQuerySet.destroy(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1389
  type(): GpuQueryType {
    console.error("(Todo)", "GpuQuerySet.type(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1390
  count(): GpuSize32Out {
    console.error("(Todo)", "GpuQuerySet.count(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1391
  label(): string {
    console.error("(Todo)", "GpuQuerySet.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1392
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuQuerySet.setLabel(...)");
    return undefined as any;
  }
}
