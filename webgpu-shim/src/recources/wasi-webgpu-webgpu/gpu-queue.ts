/// <reference types="@webgpu/types" />
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuCommandBuffer } from "./gpu-command-buffer.js";
import { GpuTexture } from "./gpu-texture.js";
import type {
  GpuExtent3D,
  GpuSize64,
  GpuTexelCopyBufferLayout,
  GpuTexelCopyTextureInfo,
} from "../../types/wasi-webgpu-webgpu.js";
import { SafeNumber } from "../../supports/num-conv.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1395
export class GpuQueue {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1399
  public _handle: GPUQueue;
  public constructor(_handle: GPUQueue) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1400
  submit(commandBuffers: Array<GpuCommandBuffer>): void {
    this._handle.submit(commandBuffers.map((buf) => buf._handle));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1401
  onSubmittedWorkDone(): void {
    console.error("(Todo)", "GpuQueue.onSubmittedWorkDone(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1402
  writeBufferWithCopy(
    buffer: GpuBuffer,
    bufferOffset: GpuSize64,
    data: Uint8Array,
    dataOffset: GpuSize64 | undefined,
    size: GpuSize64 | undefined,
  ): void {
    this._handle.writeBuffer(
      buffer._handle,
      SafeNumber(bufferOffset),
      data as BufferSource,
      SafeNumber(dataOffset),
      SafeNumber(size),
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1403
  writeTextureWithCopy(
    destination: GpuTexelCopyTextureInfo,
    data: Uint8Array,
    dataLayout: GpuTexelCopyBufferLayout,
    size: GpuExtent3D,
  ): void {
    const texture = destination.texture as unknown as GpuTexture;
    const dest_raw: GPUTexelCopyTextureInfo = {
      texture: texture._handle,
      mipLevel: destination.mipLevel,
      origin: destination.origin,
      aspect: destination.aspect,
    };

    const data_layout_raw: GPUTexelCopyBufferLayout = {
      offset: SafeNumber(dataLayout.offset),
      bytesPerRow: dataLayout.bytesPerRow,
      rowsPerImage: dataLayout.rowsPerImage,
    };

    this._handle.writeTexture(
      dest_raw,
      data as BufferSource,
      data_layout_raw,
      size,
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1404
  label(): string {
    console.error("(Todo)", "GpuQueue.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1405
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuQueue.setLabel(...)");
    return undefined as any;
  }
}
