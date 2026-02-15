/// <reference types="@webgpu/types" />
import { GpuBindGroup } from "./gpu-bind-group.js";
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuRenderBundle } from "./gpu-render-bundle.js";
import { GpuRenderPipeline } from "./gpu-render-pipeline.js";
import type {
  GpuIndex32,
  GpuIndexFormat,
  GpuRenderBundleDescriptor,
  GpuSignedOffset32,
  GpuSize32,
  GpuSize64,
} from "../../types/wasi-webgpu-webgpu.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1417
export class GpuRenderBundleEncoder {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1421
  public _handle: GPURenderBundleEncoder;
  public constructor(_handle: GPURenderBundleEncoder) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1422
  finish(__descriptor: GpuRenderBundleDescriptor | undefined): GpuRenderBundle {
    console.error("(Todo)", "GpuRenderBundleEncoder.finish(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1423
  label(): string {
    console.error("(Todo)", "GpuRenderBundleEncoder.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1424
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1425
  pushDebugGroup(__groupLabel: string): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.pushDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1426
  popDebugGroup(): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.popDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1427
  insertDebugMarker(__markerLabel: string): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.insertDebugMarker(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1428
  setBindGroup(
    __index: GpuIndex32,
    __bindGroup: GpuBindGroup | undefined,
    __dynamicOffsetsData: Uint32Array | undefined,
    __dynamicOffsetsDataStart: GpuSize64 | undefined,
    __dynamicOffsetsDataLength: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.setBindGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1429
  setPipeline(__pipeline: GpuRenderPipeline): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.setPipeline(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1430
  setIndexBuffer(
    __buffer: GpuBuffer,
    __indexFormat: GpuIndexFormat,
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.setIndexBuffer(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1431
  setVertexBuffer(
    __slot: GpuIndex32,
    __buffer: GpuBuffer | undefined,
    __offset: GpuSize64 | undefined,
    __size: GpuSize64 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.setVertexBuffer(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1432
  draw(
    __vertexCount: GpuSize32,
    __instanceCount: GpuSize32 | undefined,
    __firstVertex: GpuSize32 | undefined,
    __firstInstance: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.draw(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1433
  drawIndexed(
    __indexCount: GpuSize32,
    __instanceCount: GpuSize32 | undefined,
    __firstIndex: GpuSize32 | undefined,
    __baseVertex: GpuSignedOffset32 | undefined,
    __firstInstance: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.drawIndexed(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1434
  drawIndirect(__indirectBuffer: GpuBuffer, __indirectOffset: GpuSize64): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.drawIndirect(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1435
  drawIndexedIndirect(
    __indirectBuffer: GpuBuffer,
    __indirectOffset: GpuSize64,
  ): void {
    console.error("(Todo)", "GpuRenderBundleEncoder.drawIndexedIndirect(...)");
    return undefined as any;
  }
}
