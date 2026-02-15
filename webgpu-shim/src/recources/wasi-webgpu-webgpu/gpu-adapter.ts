/// <reference types="@webgpu/types" />
import { GpuAdapterInfo } from "./gpu-adapter-info.js";
import { GpuDevice } from "./gpu-device.js";
import { GpuSupportedFeatures } from "./gpu-supported-features.js";
import { GpuSupportedLimits } from "./gpu-supported-limits.js";
import type { GpuDeviceDescriptor } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1136
export class GpuAdapter {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1140
  public _handle: GPUAdapter;
  public constructor(_handle: GPUAdapter) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1141
  features(): GpuSupportedFeatures {
    console.error("(Todo)", "GpuAdapter.features(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1142
  limits(): GpuSupportedLimits {
    console.error("(Todo)", "GpuAdapter.limits(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1143
  info(): GpuAdapterInfo {
    console.error("(Todo)", "GpuAdapter.info(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1144
  isFallbackAdapter(): boolean {
    console.error("(Todo)", "GpuAdapter.isFallbackAdapter(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1145
  requestDevice(__descriptor: GpuDeviceDescriptor | undefined): GpuDevice {
    console.error("(Todo)", "GpuAdapter.requestDevice(...)");
    return undefined as any;
  }
}
