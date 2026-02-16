import type {
  GpuTextureFormat,
  GpuTextureViewDimension,
} from "../types/wasi-webgpu-webgpu.js";

const TEXTURE_FORMAT_MAP: Partial<Record<GpuTextureFormat, GPUTextureFormat>> =
  {
    r8unorm: "r8unorm",
    rgba8uint: "rgba8uint",
    r8snorm: "r8snorm",
    r8uint: "r8uint",
    r8sint: "r8sint",
    r16uint: "r16uint",
    r16sint: "r16sint",
    r16float: "r16float",
    rg8unorm: "rg8unorm",
    rg8snorm: "rg8snorm",
    rg8uint: "rg8uint",
    rg8sint: "rg8sint",
    r32uint: "r32uint",
    r32sint: "r32sint",
    r32float: "r32float",
    rg16uint: "rg16uint",
    rg16sint: "rg16sint",
    rg16float: "rg16float",
    rgba8unorm: "rgba8unorm",
    "rgba8unorm-srgb": "rgba8unorm-srgb",
    rgba8snorm: "rgba8snorm",
    // rgba8uint: "rgba8uint",
    rgba8sint: "rgba8sint",
    bgra8unorm: "bgra8unorm",
    "bgra8unorm-srgb": "bgra8unorm-srgb",
    rgb9e5ufloat: "rgb9e5ufloat",
    rgb10a2uint: "rgb10a2uint",
    rgb10a2unorm: "rgb10a2unorm",
    rg11b10ufloat: "rg11b10ufloat",
    rg32uint: "rg32uint",
    rg32sint: "rg32sint",
    rg32float: "rg32float",
    rgba16uint: "rgba16uint",
    rgba16sint: "rgba16sint",
    rgba16float: "rgba16float",
    rgba32uint: "rgba32uint",
    rgba32sint: "rgba32sint",
    rgba32float: "rgba32float",
    stencil8: "stencil8",
    depth16unorm: "depth16unorm",
    depth24plus: "depth24plus",
    "depth24plus-stencil8": "depth24plus-stencil8",
    depth32float: "depth32float",
    "depth32float-stencil8": "depth32float-stencil8",
    "bc1-rgba-unorm": "bc1-rgba-unorm",
    "bc1-rgba-unorm-srgb": "bc1-rgba-unorm-srgb",
    "bc2-rgba-unorm": "bc2-rgba-unorm",
    "bc2-rgba-unorm-srgb": "bc2-rgba-unorm-srgb",
    "bc3-rgba-unorm": "bc3-rgba-unorm",
    "bc3-rgba-unorm-srgb": "bc3-rgba-unorm-srgb",
    "bc4-r-unorm": "bc4-r-unorm",
    "bc4-r-snorm": "bc4-r-snorm",
    "bc5-rg-unorm": "bc5-rg-unorm",
    "bc5-rg-snorm": "bc5-rg-snorm",
    "bc6h-rgb-ufloat": "bc6h-rgb-ufloat",
    "bc6h-rgb-float": "bc6h-rgb-float",
    "bc7-rgba-unorm": "bc7-rgba-unorm",
    "bc7-rgba-unorm-srgb": "bc7-rgba-unorm-srgb",
    "etc2-rgb8unorm": "etc2-rgb8unorm",
    "etc2-rgb8unorm-srgb": "etc2-rgb8unorm-srgb",
    "etc2-rgb8a1unorm": "etc2-rgb8a1unorm",
    "etc2-rgb8a1unorm-srgb": "etc2-rgb8a1unorm-srgb",
    "etc2-rgba8unorm": "etc2-rgba8unorm",
    "etc2-rgba8unorm-srgb": "etc2-rgba8unorm-srgb",
    "eac-r11unorm": "eac-r11unorm",
    "eac-r11snorm": "eac-r11snorm",
    "eac-rg11unorm": "eac-rg11unorm",
    "eac-rg11snorm": "eac-rg11snorm",
    // "astc4x4-unorm": "astc4x4-unorm",
    // "astc4x4-unorm-srgb": "astc4x4-unorm-srgb",
    // "astc5x4-unorm": "astc5x4-unorm",
    // "astc5x4-unorm-srgb": "astc5x4-unorm-srgb",
    // "astc5x5-unorm": "astc5x5-unorm",
    // "astc5x5-unorm-srgb": "astc5x5-unorm-srgb",
    // "astc6x5-unorm": "astc6x5-unorm",
    // "astc6x5-unorm-srgb": "astc6x5-unorm-srgb",
    // "astc6x6-unorm": "astc6x6-unorm",
    // "astc6x6-unorm-srgb": "astc6x6-unorm-srgb",
    // "astc8x5-unorm": "astc8x5-unorm",
    // "astc8x5-unorm-srgb": "astc8x5-unorm-srgb",
    // "astc8x6-unorm": "astc8x6-unorm",
    // "astc8x6-unorm-srgb": "astc8x6-unorm-srgb",
    // "astc8x8-unorm": "astc8x8-unorm",
    // "astc8x8-unorm-srgb": "astc8x8-unorm-srgb",
    // "astc10x5-unorm": "astc10x5-unorm",
    // "astc10x5-unorm-srgb": "astc10x5-unorm-srgb",
    // "astc10x6-unorm": "astc10x6-unorm",
    // "astc10x6-unorm-srgb": "astc10x6-unorm-srgb",
    // "astc10x8-unorm": "astc10x8-unorm",
    // "astc10x8-unorm-srgb": "astc10x8-unorm-srgb",
    // "astc10x10-unorm": "astc10x10-unorm",
    // "astc10x10-unorm-srgb": "astc10x10-unorm-srgb",
    // "astc12x10-unorm": "astc12x10-unorm",
    // "astc12x10-unorm-srgb": "astc12x10-unorm-srgb",
    // "astc12x12-unorm": "astc12x12-unorm",
    // "astc12x12-unorm-srgb": "astc12x12-unorm-srgb",
  } as const;

const TEXTURE_FORMAT_MAP_REV = Object.fromEntries(
  Object.entries(TEXTURE_FORMAT_MAP).map(([k, v]) => [v, k]),
) as Record<GPUTextureFormat, GpuTextureFormat>;

export const TextureFormat = {
  fromWasi: (v0: keyof typeof TEXTURE_FORMAT_MAP) => {
    const v = TEXTURE_FORMAT_MAP[v0];
    if (v === undefined) {
      throw new Error(`Shim: Missing mapping for "${v0}"`);
    }
    return v;
  },
  intoWasi: (v0: keyof typeof TEXTURE_FORMAT_MAP_REV) => {
    const v = TEXTURE_FORMAT_MAP_REV[v0];
    if (v === undefined) {
      throw new Error(`Shim: Missing mapping for "${v0}"`);
    }
    return v;
  },
};

export const TEXTURE_VIEW_DIMENSION_MAP: Record<
  GpuTextureViewDimension,
  GPUTextureViewDimension
> = {
  d1: "1d",
  d2: "2d",
  "d2-array": "2d-array",
  cube: "cube",
  "cube-array": "cube-array",
  d3: "3d",
} as const;

export const TextureViewDimension = {
  fromWasi: (v0: keyof typeof TEXTURE_VIEW_DIMENSION_MAP) => {
    const v = TEXTURE_VIEW_DIMENSION_MAP[v0];
    if (v === undefined) {
      throw new Error(`Shim: Missing mapping for "${v0}"`);
    }
    return v;
  },
};
