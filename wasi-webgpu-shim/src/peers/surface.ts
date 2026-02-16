/// <reference types="@webgpu/types" />

import { computeWgpuLayout, WGpuType } from "../supports/compute-size";

export interface RenderContextPeer {
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  pipeline: GPURenderPipeline;
  uniformLayout: GPUBindGroupLayout;
  textureLayout: GPUBindGroupLayout;
}

export const UniformInfoSchema = {
  screen_size: WGpuType.vec2f,
  dithering: WGpuType.u32,
  texture_filtering: WGpuType.u32,
} as const;

export const UNIFORM_LAYOUT_SIZE = computeWgpuLayout(UniformInfoSchema).size;

export const VertexLayout = {
  position: WGpuType.vec2f,
  uv: WGpuType.vec2f,
  color: WGpuType.u32,
};

export const VERTEX_LAYOUT_SIZE = computeWgpuLayout(VertexLayout);
