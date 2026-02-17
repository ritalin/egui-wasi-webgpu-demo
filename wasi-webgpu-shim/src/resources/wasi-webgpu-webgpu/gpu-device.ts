/// <reference types="@webgpu/types" />
// import { poll } from "@bytecodealliance/preview2-shim/io";
import { Context } from "../wasi-graphics-context-graphics-context/context.js";
import { GpuAdapterInfo } from "./gpu-adapter-info.js";
import { GpuBindGroupLayout } from "./gpu-bind-group-layout.js";
import { GpuBindGroup } from "./gpu-bind-group.js";
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuCommandEncoder } from "./gpu-command-encoder.js";
import { GpuComputePipeline } from "./gpu-compute-pipeline.js";
import { GpuDeviceLostInfo } from "./gpu-device-lost-info.js";
import { GpuError } from "./gpu-error.js";
import { GpuPipelineLayout } from "./gpu-pipeline-layout.js";
import { GpuQuerySet } from "./gpu-query-set.js";
import { GpuQueue } from "./gpu-queue.js";
import { GpuRenderBundleEncoder } from "./gpu-render-bundle-encoder.js";
import { GpuRenderPipeline } from "./gpu-render-pipeline.js";
import { GpuSampler } from "./gpu-sampler.js";
import { GpuShaderModule } from "./gpu-shader-module.js";
import { GpuSupportedFeatures } from "./gpu-supported-features.js";
import { GpuSupportedLimits } from "./gpu-supported-limits.js";
import { GpuTexture } from "./gpu-texture.js";
import { GpuTextureView } from "./gpu-texture-view.js";
import type {
  GpuBindGroupDescriptor,
  GpuBindGroupLayoutDescriptor,
  GpuBufferDescriptor,
  GpuCommandEncoderDescriptor,
  GpuComputePipelineDescriptor,
  GpuErrorFilter,
  GpuPipelineLayoutDescriptor,
  GpuQuerySetDescriptor,
  GpuRenderBundleEncoderDescriptor,
  GpuRenderPipelineDescriptor,
  GpuSamplerDescriptor,
  GpuShaderModuleDescriptor,
  GpuTextureDescriptor,
} from "../../types/wasi-webgpu-webgpu.js";
import { TextureFormat } from "../../supports/enum-conv.js";
import { Pollable } from "../../types/wasi-io-poll.js";
import { SafeU64, StrictU64 } from "../../supports/num-conv.js";
// origin: src/types/wasi-webgpu-webgpu.d.ts:1314
export class GpuDevice {
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1318
  public _handle: GPUDevice;
  public constructor(_handle: GPUDevice) {
    this._handle = _handle;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1319
  features(): GpuSupportedFeatures {
    console.error("(Todo)", "GpuDevice.features(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1320
  limits(): GpuSupportedLimits {
    console.error("(Todo)", "GpuDevice.limits(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1321
  adapterInfo(): GpuAdapterInfo {
    console.error("(Todo)", "GpuDevice.adapterInfo(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1322
  queue(): GpuQueue {
    return new GpuQueue(this._handle.queue);
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1323
  destroy(): void {
    this._handle.destroy();
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1324
  createBuffer(descriptor: GpuBufferDescriptor): GpuBuffer {
    const desc: GPUBufferDescriptor = {
      label: descriptor.label,
      size: StrictU64(descriptor.size),
      usage: descriptor.usage,
      mappedAtCreation: descriptor.mappedAtCreation,
    };

    return new GpuBuffer(this._handle.createBuffer(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1325
  createTexture(descriptor: GpuTextureDescriptor): GpuTexture {
    const desc: GPUTextureDescriptor = {
      label: descriptor.label,
      size: descriptor.size,
      format: TextureFormat.fromWasi(descriptor.format),
      usage: descriptor.usage,
    };

    return new GpuTexture(this._handle.createTexture(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1326
  createSampler(descriptor: GpuSamplerDescriptor | undefined): GpuSampler {
    if (descriptor !== undefined) {
      const desc: GPUSamplerDescriptor = {
        label: descriptor.label,
        addressModeU: descriptor.addressModeU,
        addressModeV: descriptor.addressModeV,
        addressModeW: descriptor.addressModeW,
        magFilter: descriptor.magFilter,
        minFilter: descriptor.minFilter,
        mipmapFilter: descriptor.mipmapFilter,
        lodMinClamp: descriptor.lodMinClamp,
        lodMaxClamp: descriptor.lodMaxClamp,
        compare: descriptor.compare,
        maxAnisotropy: descriptor.maxAnisotropy,
      };

      return new GpuSampler(this._handle.createSampler(desc));
    }

    return new GpuSampler(this._handle.createSampler());
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1327
  createBindGroupLayout(
    __descriptor: GpuBindGroupLayoutDescriptor,
  ): GpuBindGroupLayout {
    console.error("(Todo)", "GpuDevice.createBindGroupLayout(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1328
  createPipelineLayout(
    __descriptor: GpuPipelineLayoutDescriptor,
  ): GpuPipelineLayout {
    console.error("(Todo)", "GpuDevice.createPipelineLayout(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1329
  createBindGroup(descriptor: GpuBindGroupDescriptor): GpuBindGroup {
    const layout = descriptor.layout as unknown as GpuBindGroupLayout;

    const desc: GPUBindGroupDescriptor = {
      label: descriptor.label,
      layout: layout._handle,
      entries: descriptor.entries.map((e0) => {
        const res0 = e0.resource;
        const binding = e0.binding;
        let res: GPUBindingResource;

        switch (res0.tag) {
          case "gpu-buffer-binding": {
            const val = res0.val.buffer as unknown as GpuBuffer;
            res = {
              buffer: val._handle,
              offset: SafeU64(res0.val.offset),
              size: SafeU64(res0.val.size),
            };
            break;
          }
          case "gpu-sampler": {
            const val = res0.val as unknown as GpuSampler;
            res = val._handle;
            break;
          }
          case "gpu-texture-view":
            const val = res0.val as unknown as GpuTextureView;
            res = val._handle;
            break;
        }

        const e: GPUBindGroupEntry = {
          binding: binding,
          resource: res,
        };
        return e;
      }),
    };

    return new GpuBindGroup(this._handle.createBindGroup(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1330
  createShaderModule(__descriptor: GpuShaderModuleDescriptor): GpuShaderModule {
    console.error("(Todo)", "GpuDevice.createShaderModule(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1331
  createComputePipeline(
    __descriptor: GpuComputePipelineDescriptor,
  ): GpuComputePipeline {
    console.error("(Todo)", "GpuDevice.createComputePipeline(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1332
  createRenderPipeline(
    __descriptor: GpuRenderPipelineDescriptor,
  ): GpuRenderPipeline {
    console.error("(Todo)", "GpuDevice.createRenderPipeline(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1333
  createComputePipelineAsync(
    __descriptor: GpuComputePipelineDescriptor,
  ): GpuComputePipeline {
    console.error("(Todo)", "GpuDevice.createComputePipelineAsync(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1334
  createRenderPipelineAsync(
    __descriptor: GpuRenderPipelineDescriptor,
  ): GpuRenderPipeline {
    console.error("(Todo)", "GpuDevice.createRenderPipelineAsync(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1335
  createCommandEncoder(
    descriptor: GpuCommandEncoderDescriptor | undefined,
  ): GpuCommandEncoder {
    if (descriptor === undefined) {
      return new GpuCommandEncoder(this._handle.createCommandEncoder());
    }

    const desc: GPUCommandEncoderDescriptor = {
      label: descriptor.label,
    };
    return new GpuCommandEncoder(this._handle.createCommandEncoder(desc));
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1336
  createRenderBundleEncoder(
    __descriptor: GpuRenderBundleEncoderDescriptor,
  ): GpuRenderBundleEncoder {
    console.error("(Todo)", "GpuDevice.createRenderBundleEncoder(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1337
  createQuerySet(__descriptor: GpuQuerySetDescriptor): GpuQuerySet {
    console.error("(Todo)", "GpuDevice.createQuerySet(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1338
  label(): string {
    console.error("(Todo)", "GpuDevice.label(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1339
  setLabel(__label: string): void {
    console.error("(Todo)", "GpuDevice.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1340
  lost(): GpuDeviceLostInfo {
    this._handle.lost.then((info) => {
      console.log(info);
    });
    console.error("(Todo)", "GpuDevice.setLabel(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1341
  pushErrorScope(__filter: GpuErrorFilter): void {
    console.error("(Todo)", "GpuDevice.pushErrorScope(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1342
  popErrorScope(): GpuError | undefined {
    console.error("(Todo)", "GpuDevice.popErrorScope(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1343
  onuncapturederrorSubscribe(): Pollable {
    console.error("(Todo)", "GpuDevice.onuncapturederrorSubscribe(...)");
    return undefined as any;
  }
  // origin: src/types/wasi-webgpu-webgpu.d.ts:1344
  connectGraphicsContext(__context: Context): void {
    console.error("(Todo)", "GpuDevice.connectGraphicsContext(...)");
    return undefined as any;
  }
}
