/// <reference types="@webgpu/types" />
import { GpuAdapter } from "./gpu-adapter.js";
import { WgslLanguageFeatures } from "./wgsl-language-features.js";
import type {
  GpuRequestAdapterOptions,
  GpuTextureFormat,
} from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1126
export class Gpu {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1130
  public _handle: GPU;
  public constructor(_handle: GPU) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1131
  requestAdapter(
    __options: GpuRequestAdapterOptions | undefined,
  ): GpuAdapter | undefined {
    console.error("(Todo)", "Gpu.requestAdapter(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1132
  getPreferredCanvasFormat(): GpuTextureFormat {
    console.error("(Todo)", "Gpu.getPreferredCanvasFormat(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1133
  wgslLanguageFeatures(): WgslLanguageFeatures {
    console.error("(Todo)", "Gpu.wgslLanguageFeatures(...)");
    return undefined as any;
  }
}
