import peer = globalThis;
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuCommandBuffer } from "./gpu-command-buffer.js";
import type { GpuExtent3D, GpuSize64, GpuTexelCopyBufferLayout, GpuTexelCopyTextureInfo } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuQueue {
    readonly _handle: peer.GPUQueue;
    constructor(_handle: peer.GPUQueue);
    submit(commandBuffers: Array<GpuCommandBuffer>): void;
    onSubmittedWorkDone(): void;
    writeBufferWithCopy(buffer: GpuBuffer, bufferOffset: GpuSize64, data: Uint8Array, dataOffset: GpuSize64 | undefined, size: GpuSize64 | undefined): void;
    writeTextureWithCopy(destination: GpuTexelCopyTextureInfo, data: Uint8Array, dataLayout: GpuTexelCopyBufferLayout, size: GpuExtent3D): void;
    label(): string;
    setLabel(label: string): void;
}
