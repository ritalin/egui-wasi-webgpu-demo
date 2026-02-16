import peer = globalThis;
import type { GpuDeviceLostReason } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuDeviceLostInfo {
    private readonly _handle;
    constructor(_handle: peer.GPUDeviceLostInfo);
    reason(): GpuDeviceLostReason;
    message(): string;
}
