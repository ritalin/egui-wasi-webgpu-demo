import peer = globalThis;
import type { GpuErrorKind } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuError {
    private readonly _handle;
    constructor(_handle: peer.GPUError);
    message(): string;
    kind(): GpuErrorKind;
}
