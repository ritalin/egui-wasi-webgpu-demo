export const WGpuType = {
  f32: { size: 4, align: 4, format: "float32" },
  u32: { size: 4, align: 4, format: "uint32" },
  vec2f: { size: 8, align: 8, format: "float32x2" },
  vec3f: { size: 12, align: 16, format: "float32x3" },
  vec4f: { size: 16, align: 16, format: "float32x4" },
} as const;

type WgpuType = (typeof WGpuType)[keyof typeof WGpuType];

export const computeWgpuLayout = (
  schema: Record<string, WgpuType>,
  forceAlign: number = 4,
) => {
  let offset = 0;
  const fields: Record<string, number> = {};
  for (const [key, type] of Object.entries(schema)) {
    // Arrange alignment for WebGPU
    offset = Math.ceil(offset / type.align) * type.align;
    fields[key] = offset;
    offset += type.size;
  }
  // align to 16byte
  const size = Math.ceil(offset / forceAlign) * forceAlign;
  return { size, fields };
};
