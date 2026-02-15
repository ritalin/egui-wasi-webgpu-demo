export interface RenderContextPeer {
    device: GPUDevice;
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;
    pipeline: GPURenderPipeline;
    uniformLayout: GPUBindGroupLayout;
    textureLayout: GPUBindGroupLayout;
}
export declare const UniformInfoSchema: {
    readonly screen_size: {
        readonly size: 8;
        readonly align: 8;
        readonly format: "float32x2";
    };
    readonly dithering: {
        readonly size: 4;
        readonly align: 4;
        readonly format: "uint32";
    };
    readonly texture_filtering: {
        readonly size: 4;
        readonly align: 4;
        readonly format: "uint32";
    };
};
export declare const UNIFORM_LAYOUT_SIZE: number;
export declare const VertexLayout: {
    position: {
        readonly size: 8;
        readonly align: 8;
        readonly format: "float32x2";
    };
    uv: {
        readonly size: 8;
        readonly align: 8;
        readonly format: "float32x2";
    };
    color: {
        readonly size: 4;
        readonly align: 4;
        readonly format: "uint32";
    };
};
export declare const VERTEX_LAYOUT_SIZE: {
    size: number;
    fields: {};
};
