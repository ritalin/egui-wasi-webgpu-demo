import peer = globalThis;
import type { GpuCompilationMessageType } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuCompilationMessage {
    private readonly _handle;
    constructor(_handle: peer.GPUCompilationMessage);
    message(): string;
    type(): GpuCompilationMessageType;
    lineNum(): bigint;
    linePos(): bigint;
    offset(): bigint;
    length(): bigint;
}
