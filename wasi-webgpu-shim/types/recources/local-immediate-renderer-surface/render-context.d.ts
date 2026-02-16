import { GpuBindGroupLayout } from "../wasi-webgpu-webgpu/gpu-bind-group-layout.js";
import { GpuCanvasContext } from "../wasi-webgpu-webgpu/gpu-canvas-context.js";
import { GpuDevice } from "../wasi-webgpu-webgpu/gpu-device.js";
import { GpuRenderPipeline } from "../wasi-webgpu-webgpu/gpu-render-pipeline.js";
import type { FrameSize } from "../../types/local-immediate-renderer-surface.js";
import { RenderContextPeer } from "../../peers/surface.js";
export declare class RenderContext {
    private readonly _handle;
    constructor(_handle: RenderContextPeer);
    size(): FrameSize;
    scaleFactor(): number;
    requestSetSize(size: FrameSize): void;
    getDevice(): GpuDevice;
    getCanvas(): GpuCanvasContext;
    getPipeline(): GpuRenderPipeline;
    getUniformLayout(): GpuBindGroupLayout;
    getTextureLayout(): GpuBindGroupLayout;
}
