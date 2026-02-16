import peer = globalThis;
export declare class GpuTextureView {
    readonly _handle: peer.GPUTextureView;
    constructor(_handle: peer.GPUTextureView);
    label(): string;
    setLabel(label: string): void;
}
