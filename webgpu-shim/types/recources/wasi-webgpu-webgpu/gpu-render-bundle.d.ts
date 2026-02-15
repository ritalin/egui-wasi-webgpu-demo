import peer = globalThis;
export declare class GpuRenderBundle {
    private readonly _handle;
    constructor(_handle: peer.GPURenderBundle);
    label(): string;
    setLabel(label: string): void;
}
