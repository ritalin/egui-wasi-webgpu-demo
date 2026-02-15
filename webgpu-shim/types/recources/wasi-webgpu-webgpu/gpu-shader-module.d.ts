import peer = globalThis;
import { GpuCompilationInfo } from "./gpu-compilation-info.js";
export declare class GpuShaderModule {
    private readonly _handle;
    constructor(_handle: peer.GPUShaderModule);
    getCompilationInfo(): GpuCompilationInfo;
    label(): string;
    setLabel(label: string): void;
}
