import peer = globalThis;
export declare class GpuSampler {
    readonly _handle: peer.GPUSampler;
    constructor(_handle: peer.GPUSampler);
    label(): string;
    setLabel(label: string): void;
}
