import peer = globalThis;
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuCommandBuffer } from "./gpu-command-buffer.js";
import { GpuComputePassEncoder } from "./gpu-compute-pass-encoder.js";
import { GpuQuerySet } from "./gpu-query-set.js";
import { GpuRenderPassEncoder } from "./gpu-render-pass-encoder.js";
import type { GpuCommandBufferDescriptor, GpuComputePassDescriptor, GpuExtent3D, GpuRenderPassDescriptor, GpuSize32, GpuSize64, GpuTexelCopyBufferInfo, GpuTexelCopyTextureInfo } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuCommandEncoder {
    private readonly _handle;
    constructor(_handle: peer.GPUCommandEncoder);
    beginRenderPass(descriptor: GpuRenderPassDescriptor): GpuRenderPassEncoder;
    beginComputePass(descriptor: GpuComputePassDescriptor | undefined): GpuComputePassEncoder;
    copyBufferToBuffer(source: GpuBuffer, sourceOffset: GpuSize64, destination: GpuBuffer, destinationOffset: GpuSize64, size: GpuSize64): void;
    copyBufferToTexture(source: GpuTexelCopyBufferInfo, destination: GpuTexelCopyTextureInfo, copySize: GpuExtent3D): void;
    copyTextureToBuffer(source: GpuTexelCopyTextureInfo, destination: GpuTexelCopyBufferInfo, copySize: GpuExtent3D): void;
    copyTextureToTexture(source: GpuTexelCopyTextureInfo, destination: GpuTexelCopyTextureInfo, copySize: GpuExtent3D): void;
    clearBuffer(buffer: GpuBuffer, offset: GpuSize64 | undefined, size: GpuSize64 | undefined): void;
    resolveQuerySet(querySet: GpuQuerySet, firstQuery: GpuSize32, queryCount: GpuSize32, destination: GpuBuffer, destinationOffset: GpuSize64): void;
    finish(descriptor: GpuCommandBufferDescriptor | undefined): GpuCommandBuffer;
    label(): string;
    setLabel(label: string): void;
    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;
}
