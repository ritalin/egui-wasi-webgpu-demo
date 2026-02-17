/// <reference types="@webgpu/types" />

import { RenderContext } from "./resources/local-immediate-renderer-surface/render-context.js";
import {
  type RenderContextPeer,
  UNIFORM_LAYOUT_SIZE,
  VERTEX_LAYOUT_SIZE,
} from "./peers/surface.js";
import {
  TextureFormat,
  GpuDevice,
  GpuBindGroupLayout,
  GpuCanvasContext,
  GpuRenderPipeline,
} from "wasi-webgpu-shim/host-api";
import SHADER_SOURCE from "./shaders/shader.wgsl.js";
import type { FrameSize } from "./types/local-immediate-renderer-surface.js";

export interface IRenderContext {
  size(): FrameSize;
  scaleFactor(): number;
  requestSetSize(size: FrameSize): void;
  getDevice(): GpuDevice;
  getCanvas(): GpuCanvasContext;
  getPipeline(): GpuRenderPipeline;
  getUniformLayout(): GpuBindGroupLayout;
  getTextureLayout(): GpuBindGroupLayout;
}
class ProtectedRenderContext extends RenderContext implements IRenderContext {}

export class WebGpuRuntime {
  private device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  createRenderContext(canvas: HTMLCanvasElement): IRenderContext {
    const format = navigator.gpu.getPreferredCanvasFormat();
    const uniformLayout = createUniformBindgroupLayout(this.device);
    const textureLayout = createtextureBindgroupLayout(this.device);

    const canvasContext = canvas.getContext("webgpu");
    if (canvasContext === null) {
      throw new Error("WebGPU is not supported");
    }

    const peer: RenderContextPeer = {
      device: this.device,
      canvas: canvas,
      context: canvasContext,
      pipeline: createRenderPipeline(this.device, format, [
        uniformLayout,
        textureLayout,
      ]),
      uniformLayout,
      textureLayout,
    };
    const context = new ProtectedRenderContext(peer);

    context.getCanvas().configure({
      device: new GpuDevice(this.device),
      format: TextureFormat.intoWasi(format),
    });
    console.log("Surface configured");

    return context;
  }
}

export const createWebGpuRuntime = async function (): Promise<WebGpuRuntime> {
  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported.");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (adapter === null) {
    throw new Error(
      "Can not create WebGpuRuntime (reason: GPUAdapter is null)",
    );
  }
  const device = await adapter.requestDevice();

  device.lost.then((info) => console.error("gpu-device", info));
  return new WebGpuRuntime(device);
};

function createUniformBindgroupLayout(device: GPUDevice): GPUBindGroupLayout {
  const desc: GPUBindGroupLayoutDescriptor = {
    label: "uniform bindgroup layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: UNIFORM_LAYOUT_SIZE,
        },
      },
    ],
  };

  return device.createBindGroupLayout(desc);
}

function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  bindGroups: Array<GPUBindGroupLayout>,
): GPURenderPipeline {
  const module_desc: GPUShaderModuleDescriptor = {
    label: "shader",
    code: SHADER_SOURCE,
    compilationHints: undefined,
  };
  const module_raw = device.createShaderModule(module_desc);

  const layout_desc: GPUPipelineLayoutDescriptor = {
    label: "Render pipeline layout",
    bindGroupLayouts: bindGroups,
    immediateSize: 0,
  };
  const layout_raw = device.createPipelineLayout(layout_desc);

  const pipeline_desc: GPURenderPipelineDescriptor = {
    label: "Render pipeline",
    layout: layout_raw,
    vertex: vertexDesc(module_raw),
    fragment: fragmentDesc(module_raw, format),
    primitive: primitiveDesc(),
    multisample: { count: 1, mask: 0xffffffff, alphaToCoverageEnabled: false },
    depthStencil: undefined,
  };
  return device.createRenderPipeline(pipeline_desc);
}

function vertexDesc(shader_raw: GPUShaderModule): GPUVertexState {
  console.log({
    vertexStride: VERTEX_LAYOUT_SIZE.size,
    offset1: VERTEX_LAYOUT_SIZE.fields["uv"],
    offset2: VERTEX_LAYOUT_SIZE.fields["color"],
  });
  const desc: GPUVertexState = {
    module: shader_raw,
    entryPoint: "vs_main",
    constants: undefined,
    buffers: [
      {
        arrayStride: VERTEX_LAYOUT_SIZE.size,
        stepMode: "vertex",
        attributes: [
          {
            format: "float32x2",
            offset: 0,
            shaderLocation: 0,
          },
          {
            format: "float32x2",
            offset: VERTEX_LAYOUT_SIZE.fields["uv"],
            shaderLocation: 1,
          },
          {
            format: "uint32",
            offset: VERTEX_LAYOUT_SIZE.fields["color"],
            shaderLocation: 2,
          },
        ],
      },
    ],
  };
  return desc;
}

function fragmentDesc(
  shader_raw: GPUShaderModule,
  format: GPUTextureFormat,
): GPUFragmentState {
  const desc: GPUFragmentState = {
    module: shader_raw,
    entryPoint: "fs_main",
    constants: undefined,
    targets: [
      {
        format: format,
        blend: {
          color: {
            srcFactor: "one",
            dstFactor: "one-minus-src-alpha",
            operation: "add",
          },
          alpha: {
            srcFactor: "one-minus-dst-alpha",
            dstFactor: "one",
            operation: "add",
          },
        },
        writeMask: GPUColorWrite.ALL,
      },
    ],
  };
  return desc;
}

function primitiveDesc(): GPUPrimitiveState {
  const desc: GPUPrimitiveState = {
    topology: "triangle-list",
    stripIndexFormat: undefined,
    frontFace: "ccw",
    cullMode: undefined,
    unclippedDepth: false,
  };
  return desc;
}

function createtextureBindgroupLayout(device: GPUDevice): GPUBindGroupLayout {
  const desc: GPUBindGroupLayoutDescriptor = {
    label: "texture bindgroup layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: "float",
          viewDimension: "2d",
          multisampled: false,
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {
          type: "filtering",
        },
      },
    ],
  };

  return device.createBindGroupLayout(desc);
}
