import peer = globalThis;
import type { GpuBufferMapState, GpuFlagsConstant, GpuMapModeFlags, GpuSize64, GpuSize64Out } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuBuffer {
    readonly _handle: peer.GPUBuffer;
    constructor(_handle: peer.GPUBuffer);
    size(): GpuSize64Out;
    usage(): GpuFlagsConstant;
    mapState(): GpuBufferMapState;
    mapAsync(mode: GpuMapModeFlags, offset: GpuSize64 | undefined, size: GpuSize64 | undefined): void;
    getMappedRangeGetWithCopy(offset: GpuSize64 | undefined, size: GpuSize64 | undefined): Uint8Array;
    unmap(): void;
    destroy(): void;
    label(): string;
    setLabel(label: string): void;
    getMappedRangeSetWithCopy(data: Uint8Array, offset: GpuSize64 | undefined, size: GpuSize64 | undefined): void;
}
