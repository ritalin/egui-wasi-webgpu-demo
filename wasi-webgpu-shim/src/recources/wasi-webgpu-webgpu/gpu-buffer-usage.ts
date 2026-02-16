/// <reference types="@webgpu/types" />
import type { GpuFlagsConstant } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1196
export class GpuBufferUsage {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1200
  public _handle: GPUBufferUsage;
  public constructor(_handle: GPUBufferUsage) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1201
  static mapRead(): GpuFlagsConstant {
    return GPUBufferUsage.MAP_READ;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1202
  static mapWrite(): GpuFlagsConstant {
    return GPUBufferUsage.MAP_WRITE;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1203
  static copySrc(): GpuFlagsConstant {
    return GPUBufferUsage.COPY_SRC;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1204
  static copyDst(): GpuFlagsConstant {
    return GPUBufferUsage.COPY_DST;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1205
  static index(): GpuFlagsConstant {
    return GPUBufferUsage.INDEX;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1206
  static vertex(): GpuFlagsConstant {
    return GPUBufferUsage.VERTEX;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1207
  static uniform(): GpuFlagsConstant {
    return GPUBufferUsage.UNIFORM;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1208
  static storage(): GpuFlagsConstant {
    return GPUBufferUsage.STORAGE;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1209
  static indirect(): GpuFlagsConstant {
    return GPUBufferUsage.INDIRECT;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1210
  static queryResolve(): GpuFlagsConstant {
    return GPUBufferUsage.QUERY_RESOLVE;
  }
}
