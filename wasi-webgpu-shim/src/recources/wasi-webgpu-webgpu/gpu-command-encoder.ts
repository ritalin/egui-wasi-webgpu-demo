/// <reference types="@webgpu/types" />
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuCommandBuffer } from "./gpu-command-buffer.js";
import { GpuComputePassEncoder } from "./gpu-compute-pass-encoder.js";
import { GpuQuerySet } from "./gpu-query-set.js";
import { GpuRenderPassEncoder } from "./gpu-render-pass-encoder.js";
import { GpuTextureView } from "./gpu-texture-view.js";
import type {
  GpuCommandBufferDescriptor,
  GpuComputePassDescriptor,
  GpuExtent3D,
  GpuRenderPassDescriptor,
  GpuSize32,
  GpuSize64,
  GpuTexelCopyBufferInfo,
  GpuTexelCopyTextureInfo,
} from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1245
export class GpuCommandEncoder {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1249
  public _handle: GPUCommandEncoder;
  public constructor(_handle: GPUCommandEncoder) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1250
  beginRenderPass(descriptor: GpuRenderPassDescriptor): GpuRenderPassEncoder {
    const desc: GPURenderPassDescriptor = {
      label: descriptor.label,
      colorAttachments: descriptor.colorAttachments.map((att) => {
        if (!att) return undefined as unknown as GPURenderPassColorAttachment;

        const att_raw: GPURenderPassColorAttachment = {
          view: (att.view as unknown as GpuTextureView)._handle,
          loadOp: att.loadOp,
          storeOp: att.storeOp,
        };
        return att_raw;
      }),
    };
    return new GpuRenderPassEncoder(this._handle.beginRenderPass(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1251
  beginComputePass(
    __descriptor: GpuComputePassDescriptor | undefined,
  ): GpuComputePassEncoder {
    console.error("(Todo)", "GpuCommandEncoder.beginComputePass(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1252
  copyBufferToBuffer(
    __source: GpuBuffer,
    __sourceOffset: GpuSize64,
    __destination: GpuBuffer,
    __destinationOffset: GpuSize64,
    __size: GpuSize64,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.copyBufferToBuffer(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1253
  copyBufferToTexture(
    __source: GpuTexelCopyBufferInfo,
    __destination: GpuTexelCopyTextureInfo,
    __copySize: GpuExtent3D,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.copyBufferToTexture(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1254
  copyTextureToBuffer(
    __source: GpuTexelCopyTextureInfo,
    __destination: GpuTexelCopyBufferInfo,
    __copySize: GpuExtent3D,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.copyTextureToBuffer(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1255
  copyTextureToTexture(
    __source: GpuTexelCopyTextureInfo,
    __destination: GpuTexelCopyTextureInfo,
    __copySize: GpuExtent3D,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.copyTextureToTexture(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1256
  clearBuffer(
    __buffer: GpuBuffer,
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.clearBuffer(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1257
  resolveQuerySet(
    __querySet: GpuQuerySet,
    __firstQuery: GpuSize32,
    __queryCount: GpuSize32,
    __destination: GpuBuffer,
    __destinationOffset: GpuSize64,
  ): void {
    console.error("(Todo)", "GpuCommandEncoder.resolveQuerySet(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1258
  finish(descriptor: GpuCommandBufferDescriptor | undefined): GpuCommandBuffer {
    if (descriptor === undefined) {
      return new GpuCommandBuffer(this._handle.finish());
    }

    const desc: GPUCommandBufferDescriptor = { label: descriptor.label };
    return new GpuCommandBuffer(this._handle.finish(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1259
  label(): string {
    console.error("(Todo)", "GpuCommandEncoder.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1260
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuCommandEncoder.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1261
  pushDebugGroup(__groupLabel: string): void {
    console.error("(Todo)", "GpuCommandEncoder.pushDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1262
  popDebugGroup(): void {
    console.error("(Todo)", "GpuCommandEncoder.popDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1263
  insertDebugMarker(__markerLabel: string): void {
    console.error("(Todo)", "GpuCommandEncoder.insertDebugMarker(...)");
    return undefined as any;
  }
}
