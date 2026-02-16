/// <reference types="@webgpu/types" />
import type { GpuCompilationMessageType } from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1274
export class GpuCompilationMessage {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1278
  public _handle: GPUCompilationMessage;
  public constructor(_handle: GPUCompilationMessage) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1279
  message(): string {
    console.error("(Todo)", "GpuCompilationMessage.message(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1280
  type(): GpuCompilationMessageType {
    console.error("(Todo)", "GpuCompilationMessage.type(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1281
  lineNum(): bigint {
    console.error("(Todo)", "GpuCompilationMessage.lineNum(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1282
  linePos(): bigint {
    console.error("(Todo)", "GpuCompilationMessage.linePos(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1283
  offset(): bigint {
    console.error("(Todo)", "GpuCompilationMessage.offset(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1284
  length(): bigint {
    console.error("(Todo)", "GpuCompilationMessage.length(...)");
    return undefined as any;
  }
}
