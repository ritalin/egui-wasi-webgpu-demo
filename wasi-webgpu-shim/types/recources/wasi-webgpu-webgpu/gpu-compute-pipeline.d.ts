import peer = globalThis;
import { GpuBindGroupLayout } from "./gpu-bind-group-layout.js";
export declare class GpuComputePipeline {
    private readonly _handle;
    constructor(_handle: peer.GPUComputePipeline);
    label(): string;
    setLabel(label: string): void;
    getBindGroupLayout(index: number): GpuBindGroupLayout;
}
