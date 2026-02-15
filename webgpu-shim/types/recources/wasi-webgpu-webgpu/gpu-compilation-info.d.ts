import peer = globalThis;
import { GpuCompilationMessage } from "./gpu-compilation-message.js";
export declare class GpuCompilationInfo {
    private readonly _handle;
    constructor(_handle: peer.GPUCompilationInfo);
    messages(): Array<GpuCompilationMessage>;
}
