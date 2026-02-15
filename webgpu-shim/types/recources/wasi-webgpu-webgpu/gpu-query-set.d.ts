import peer = globalThis;
import type { GpuQueryType, GpuSize32Out } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuQuerySet {
    private readonly _handle;
    constructor(_handle: peer.GPUQuerySet);
    destroy(): void;
    type(): GpuQueryType;
    count(): GpuSize32Out;
    label(): string;
    setLabel(label: string): void;
}
