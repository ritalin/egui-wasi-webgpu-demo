/// <reference types="@webgpu/types" />
import type {
  GpuBufferMapState,
  GpuFlagsConstant,
  GpuMapModeFlags,
  GpuSize64,
  GpuSize64Out,
} from "../../types/wasi-webgpu-webgpu.js";

// origin: src/types/wasi-webgpu-webgpu.d.ts:1179
export class GpuBuffer {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1183
  public _handle: GPUBuffer;
  public constructor(_handle: GPUBuffer) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1184
  size(): GpuSize64Out {
    console.error("(Todo)", "GpuBuffer.size(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1185
  usage(): GpuFlagsConstant {
    console.error("(Todo)", "GpuBuffer.usage(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1186
  mapState(): GpuBufferMapState {
    console.error("(Todo)", "GpuBuffer.mapState(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1187
  mapAsync(
    __mode: GpuMapModeFlags,
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): void {
    console.error("(Todo)", "GpuBuffer.mapAsync(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1188
  getMappedRangeGetWithCopy(
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): Uint8Array {
    console.error("(Todo)", "GpuBuffer.getMappedRangeGetWithCopy(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1189
  unmap(): void {
    console.error("(Todo)", "GpuBuffer.unmap(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1190
  destroy(): void {
    console.error("(Todo)", "GpuBuffer.destroy(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1191
  label(): string {
    console.error("(Todo)", "GpuBuffer.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1192
  setLabel(_label: string): void {
    console.error("(Todo)", "GpuBuffer.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1193
  getMappedRangeSetWithCopy(
    __data: Uint8Array,
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): void {
    console.error("(Todo)", "GpuBuffer.getMappedRangeSetWithCopy(...)");
    return undefined as any;
  }
}
