/// <reference types="@webgpu/types" />
import { GpuTexture } from "./gpu-texture.js";
import { GpuDevice } from "./gpu-device.js";
import type {
  GpuCanvasConfiguration,
  GpuCanvasConfigurationOwned,
} from "../../types/wasi-webgpu-webgpu.js";
import { TextureFormat } from "../../supports/enum-conv.js";

// origin: src/types/wasi-webgpu-webgpu.d.ts:1213
export class GpuCanvasContext {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1217
  public _handle: GPUCanvasContext;
  public constructor(_handle: GPUCanvasContext) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1218
  configure(configuration: GpuCanvasConfiguration): void {
    const device = configuration.device as unknown as GpuDevice;
    const c: GPUCanvasConfiguration = {
      device: device._handle,
      format: TextureFormat.fromWasi(configuration.format),
    };
    this._handle.configure(c);
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1219
  unconfigure(): void {
    this.unconfigure();
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1220
  getConfiguration(): GpuCanvasConfigurationOwned | undefined {
    const config_raw = this._handle.getConfiguration();
    console.log("getConfiguration", config_raw);
    if (!config_raw) return;

    return {
      device: new GpuDevice(config_raw.device),
      format: TextureFormat.intoWasi(config_raw.format),
    };
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1221
  getCurrentTexture(): GpuTexture {
    const texture = this._handle.getCurrentTexture();
    return new GpuTexture(texture);
  }
}
