import peer = globalThis;
import { GpuTexture } from "./gpu-texture.js";
import type { GpuCanvasConfiguration, GpuCanvasConfigurationOwned } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuCanvasContext {
    private readonly _handle;
    constructor(_handle: peer.GPUCanvasContext);
    configure(configuration: GpuCanvasConfiguration): void;
    unconfigure(): void;
    getConfiguration(): GpuCanvasConfigurationOwned | undefined;
    getCurrentTexture(): GpuTexture;
}
