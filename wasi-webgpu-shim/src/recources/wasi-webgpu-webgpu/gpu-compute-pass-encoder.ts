/// <reference types="@webgpu/types" />
import { GpuBindGroup } from "./gpu-bind-group.js";
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuComputePipeline } from "./gpu-compute-pipeline.js";
import type {
  GpuIndex32,
  GpuSize32,
  GpuSize64,
} from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1287
export class GpuComputePassEncoder {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1291
  public _handle: GPUComputePassEncoder;
  public constructor(_handle: GPUComputePassEncoder) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1292
  setPipeline(__pipeline: GpuComputePipeline): void {
    console.error("(Todo)", "GpuComputePassEncoder.setPipeline(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1293
  dispatchWorkgroups(
    __workgroupCountX: GpuSize32,
    __workgroupCountY: GpuSize32 | undefined,
    __workgroupCountZ: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuComputePassEncoder.dispatchWorkgroups(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1294
  dispatchWorkgroupsIndirect(
    __indirectBuffer: GpuBuffer,
    __indirectOffset: GpuSize64,
  ): void {
    console.error(
      "(Todo)",
      "GpuComputePassEncoder.dispatchWorkgroupsIndirect(...)",
    );
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1295
  end(): void {
    console.error("(Todo)", "GpuComputePassEncoder.end(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1296
  label(): string {
    console.error("(Todo)", "GpuComputePassEncoder.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1297
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuComputePassEncoder.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1298
  pushDebugGroup(__groupLabel: string): void {
    console.error("(Todo)", "GpuComputePassEncoder.pushDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1299
  popDebugGroup(): void {
    console.error("(Todo)", "GpuComputePassEncoder.popDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1300
  insertDebugMarker(__markerLabel: string): void {
    console.error("(Todo)", "GpuComputePassEncoder.insertDebugMarker(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1301
  setBindGroup(
    __index: GpuIndex32,
    __bindGroup: GpuBindGroup | undefined,
    __dynamicOffsetsData: Uint32Array | undefined,
    __dynamicOffsetsDataStart: GpuSize64 | undefined,
    __dynamicOffsetsDataLength: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuComputePassEncoder.setBindGroup(...)");
    return undefined as any;
  }
}
