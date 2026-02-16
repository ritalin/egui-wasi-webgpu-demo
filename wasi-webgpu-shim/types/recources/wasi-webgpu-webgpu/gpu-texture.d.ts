import peer = globalThis;
import { AbstractBuffer } from "../wasi-graphics-context-graphics-context/abstract-buffer.js";
import { GpuTextureView } from "./gpu-texture-view.js";
import type { GpuFlagsConstant, GpuIntegerCoordinateOut, GpuSize32Out, GpuTextureDimension, GpuTextureFormat, GpuTextureViewDescriptor } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuTexture {
    readonly _handle: peer.GPUTexture;
    constructor(_handle: peer.GPUTexture);
    createView(descriptor: GpuTextureViewDescriptor | undefined): GpuTextureView;
    destroy(): void;
    width(): GpuIntegerCoordinateOut;
    height(): GpuIntegerCoordinateOut;
    depthOrArrayLayers(): GpuIntegerCoordinateOut;
    mipLevelCount(): GpuIntegerCoordinateOut;
    sampleCount(): GpuSize32Out;
    dimension(): GpuTextureDimension;
    format(): GpuTextureFormat;
    usage(): GpuFlagsConstant;
    label(): string;
    setLabel(label: string): void;
    static fromGraphicsBuffer(buffer: AbstractBuffer): GpuTexture;
}
