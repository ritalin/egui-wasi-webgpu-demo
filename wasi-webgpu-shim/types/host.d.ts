import peer = globalThis;
import { RenderContext } from "./recources/local-immediate-renderer-surface/render-context";
export declare class WebGpuRuntime {
    private readonly device;
    constructor(device: GPUDevice);
    createRenderContext(canvas: HTMLCanvasElement): RenderContext;
}
export declare const createWebGpuRuntime: () => Promise<WebGpuRuntime>;
