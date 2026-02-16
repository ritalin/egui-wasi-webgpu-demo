export declare const WGpuType: {
    readonly f32: {
        readonly size: 4;
        readonly align: 4;
        readonly format: "float32";
    };
    readonly u32: {
        readonly size: 4;
        readonly align: 4;
        readonly format: "uint32";
    };
    readonly vec2f: {
        readonly size: 8;
        readonly align: 8;
        readonly format: "float32x2";
    };
    readonly vec3f: {
        readonly size: 12;
        readonly align: 16;
        readonly format: "float32x3";
    };
    readonly vec4f: {
        readonly size: 16;
        readonly align: 16;
        readonly format: "float32x4";
    };
};
type WgpuType = (typeof WGpuType)[keyof typeof WGpuType];
export declare const computeWgpuLayout: (schema: Record<string, WgpuType>) => {
    size: number;
    fields: {};
};
export {};
