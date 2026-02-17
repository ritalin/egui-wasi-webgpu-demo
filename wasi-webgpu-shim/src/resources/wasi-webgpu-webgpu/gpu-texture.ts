/// <reference types="@webgpu/types" />
import { AbstractBuffer } from "../wasi-graphics-context-graphics-context/abstract-buffer.js";
import { GpuTextureView } from "./gpu-texture-view.js";
import type {
  GpuFlagsConstant,
  GpuIntegerCoordinateOut,
  GpuSize32Out,
  GpuTextureDimension,
  GpuTextureFormat,
  GpuTextureViewDescriptor,
} from "../../types/wasi-webgpu-webgpu.js";
import {
  TextureFormat,
  TextureViewDimension,
} from "../../supports/enum-conv.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1551
export class GpuTexture {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1555
  public _handle: GPUTexture;
  public constructor(_handle: GPUTexture) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1556
  createView(descriptor: GpuTextureViewDescriptor | undefined): GpuTextureView {
    if (descriptor !== undefined) {
      const desc: GPUTextureViewDescriptor = {
        label: descriptor.label,
        format: TextureFormat.fromWasi(descriptor.format!),
        dimension: TextureViewDimension.fromWasi(descriptor.dimension!),
        usage: descriptor.usage,
        aspect: descriptor.aspect,
        baseMipLevel: descriptor.baseMipLevel,
        mipLevelCount: descriptor.mipLevelCount,
        baseArrayLayer: descriptor.baseArrayLayer,
        arrayLayerCount: descriptor.arrayLayerCount,
        swizzle: undefined,
      };
      return new GpuTextureView(this._handle.createView(desc));
    }

    return new GpuTextureView(this._handle.createView());
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1557
  destroy(): void {
    this._handle.destroy();
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1558
  width(): GpuIntegerCoordinateOut {
    console.error("(Todo)", "GpuTexture.width(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1559
  height(): GpuIntegerCoordinateOut {
    console.error("(Todo)", "GpuTexture.height(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1560
  depthOrArrayLayers(): GpuIntegerCoordinateOut {
    console.error("(Todo)", "GpuTexture.depthOrArrayLayers(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1561
  mipLevelCount(): GpuIntegerCoordinateOut {
    console.error("(Todo)", "GpuTexture.mipLevelCount(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1562
  sampleCount(): GpuSize32Out {
    console.error("(Todo)", "GpuTexture.sampleCount(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1563
  dimension(): GpuTextureDimension {
    console.error("(Todo)", "GpuTexture.dimension(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1564
  format(): GpuTextureFormat {
    console.error("(Todo)", "GpuTexture.format(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1565
  usage(): GpuFlagsConstant {
    console.error("(Todo)", "GpuTexture.usage(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1566
  label(): string {
    console.error("(Todo)", "GpuTexture.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1567
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuTexture.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1568
  static fromGraphicsBuffer(__buffer: AbstractBuffer): GpuTexture {
    console.error("(Todo)", "GpuTexture.fromGraphicsBuffer(...)");
    return undefined as any;
  }
}
