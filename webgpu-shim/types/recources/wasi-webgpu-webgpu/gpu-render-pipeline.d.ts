import peer = globalThis;
import { GpuBindGroupLayout } from "./gpu-bind-group-layout.js";
export declare class GpuRenderPipeline {
    private readonly _handle;
    constructor(_handle: peer.GPURenderPipeline);
    label(): string;
    setLabel(label: string): void;
    getBindGroupLayout(index: number): GpuBindGroupLayout;
}
