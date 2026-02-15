/// <reference types="@webgpu/types" />
import { GpuBindGroup } from "./gpu-bind-group.js";
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuRenderBundle } from "./gpu-render-bundle.js";
import { GpuRenderPipeline } from "./gpu-render-pipeline.js";
import type {
  GpuColor,
  GpuIndex32,
  GpuIndexFormat,
  GpuIntegerCoordinate,
  GpuSignedOffset32,
  GpuSize32,
  GpuSize64,
  GpuStencilValue,
} from "../../types/wasi-webgpu-webgpu.js";
import { SafeU64, StrictU64 } from "../../supports/num-conv.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1438
export class GpuRenderPassEncoder {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1442
  public _handle: GPURenderPassEncoder;
  public constructor(_handle: GPURenderPassEncoder) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1443
  setViewport(
    __x: number,
    __y: number,
    __width: number,
    __height: number,
    __minDepth: number,
    __maxDepth: number,
  ): void {
    console.error("(Todo)", "GpuRenderPassEncoder.setViewport(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1444
  setScissorRect(
    x: GpuIntegerCoordinate,
    y: GpuIntegerCoordinate,
    width: GpuIntegerCoordinate,
    height: GpuIntegerCoordinate,
  ): void {
    this._handle.setScissorRect(x, y, width, height);
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1445
  setBlendConstant(__color: GpuColor): void {
    console.error("(Todo)", "GpuRenderPassEncoder.setBlendConstant(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1446
  setStencilReference(__reference: GpuStencilValue): void {
    console.error("(Todo)", "GpuRenderPassEncoder.setStencilReference(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1447
  beginOcclusionQuery(__queryIndex: GpuSize32): void {
    console.error("(Todo)", "GpuRenderPassEncoder.beginOcclusionQuery(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1448
  endOcclusionQuery(): void {
    console.error("(Todo)", "GpuRenderPassEncoder.endOcclusionQuery(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1449
  executeBundles(__bundles: Array<GpuRenderBundle>): void {
    console.error("(Todo)", "GpuRenderPassEncoder.executeBundles(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1450
  end(): void {
    this._handle.end();
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1451
  label(): string {
    console.error("(Todo)", "GpuRenderPassEncoder.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1452
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuRenderPassEncoder.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1453
  pushDebugGroup(__groupLabel: string): void {
    console.error("(Todo)", "GpuRenderPassEncoder.pushDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1454
  popDebugGroup(): void {
    console.error("(Todo)", "GpuRenderPassEncoder.popDebugGroup(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1455
  insertDebugMarker(__markerLabel: string): void {
    console.error("(Todo)", "GpuRenderPassEncoder.insertDebugMarker(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1456
  setBindGroup(
    index: GpuIndex32,
    bindGroup: GpuBindGroup | undefined,
    dynamicOffsetsData: Uint32Array | undefined,
    dynamicOffsetsDataStart: GpuSize64 | undefined,
    dynamicOffsetsDataLength: GpuSize32 | undefined,
  ): void {
    if (bindGroup === undefined) return;
    if (dynamicOffsetsData === undefined) {
      this._handle.setBindGroup(index, bindGroup._handle);
      return;
    }

    const start =
      dynamicOffsetsDataStart === undefined
        ? 0
        : StrictU64(dynamicOffsetsDataStart);

    const length =
      dynamicOffsetsDataLength === undefined
        ? dynamicOffsetsData.length
        : dynamicOffsetsDataLength;

    this._handle.setBindGroup(
      index,
      bindGroup._handle,
      dynamicOffsetsData.slice(),
      start,
      length,
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1457
  setPipeline(pipeline: GpuRenderPipeline): void {
    this._handle.setPipeline(pipeline._handle);
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1458
  setIndexBuffer(
    buffer: GpuBuffer,
    indexFormat: GpuIndexFormat,
    offset: GpuSize64 | undefined,
    size: GpuSize64 | undefined,
  ): void {
    this._handle.setIndexBuffer(
      buffer._handle,
      indexFormat,
      SafeU64(offset),
      SafeU64(size),
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1459
  setVertexBuffer(
    slot: GpuIndex32,
    buffer: GpuBuffer | undefined,
    offset: GpuSize64 | undefined,
    size: GpuSize64 | undefined,
  ): void {
    if (buffer === undefined) {
      this._handle.setVertexBuffer(
        slot,
        undefined,
        SafeU64(offset),
        SafeU64(size),
      );
      return;
    }

    this._handle.setVertexBuffer(
      slot,
      buffer._handle,
      SafeU64(offset),
      SafeU64(size),
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1460
  draw(
    __vertexCount: GpuSize32,
    __instanceCount: GpuSize32 | undefined,
    __firstVertex: GpuSize32 | undefined,
    __firstInstance: GpuSize32 | undefined,
  ): void {
    console.error("(Todo)", "GpuRenderPassEncoder.draw(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1461
  drawIndexed(
    indexCount: GpuSize32,
    instanceCount: GpuSize32 | undefined,
    firstIndex: GpuSize32 | undefined,
    baseVertex: GpuSignedOffset32 | undefined,
    firstInstance: GpuSize32 | undefined,
  ): void {
    this._handle.drawIndexed(
      indexCount,
      instanceCount,
      firstIndex,
      baseVertex,
      firstInstance,
    );
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1462
  drawIndirect(__indirectBuffer: GpuBuffer, __indirectOffset: GpuSize64): void {
    console.error("(Todo)", "GpuRenderPassEncoder.drawIndirect(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1463
  drawIndexedIndirect(
    __indirectBuffer: GpuBuffer,
    __indirectOffset: GpuSize64,
  ): void {
    console.error("(Todo)", "GpuRenderPassEncoder.drawIndexedIndirect(...)");
    return undefined as any;
  }
}
