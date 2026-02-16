import peer = globalThis;
export declare class GpuCommandBuffer {
    private readonly _handle;
    constructor(_handle: peer.GPUCommandBuffer);
    label(): string;
    setLabel(label: string): void;
}
