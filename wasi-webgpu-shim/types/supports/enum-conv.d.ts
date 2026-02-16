import { GpuTextureFormat, GpuTextureViewDimension } from "../types/wasi-webgpu-webgpu";
declare const TEXTURE_FORMAT_MAP: Partial<Record<GpuTextureFormat, GPUTextureFormat>>;
declare const TEXTURE_FORMAT_MAP_REV: Record<GPUTextureFormat, GpuTextureFormat>;
export declare const TextureFormat: {
    fromWasi: (v0: keyof typeof TEXTURE_FORMAT_MAP) => GPUTextureFormat;
    intoWasi: (v0: keyof typeof TEXTURE_FORMAT_MAP_REV) => GpuTextureFormat;
};
export declare const TEXTURE_VIEW_DIMENSION_MAP: Record<GpuTextureViewDimension, GPUTextureViewDimension>;
export declare const TextureViewDimension: {
    fromWasi: (v0: keyof typeof TEXTURE_VIEW_DIMENSION_MAP) => GPUTextureViewDimension;
};
export {};
