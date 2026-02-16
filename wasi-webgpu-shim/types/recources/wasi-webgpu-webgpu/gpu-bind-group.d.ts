import peer = globalThis;
export declare class GpuBindGroup {
    readonly _handle: peer.GPUBindGroup;
    constructor(_handle: peer.GPUBindGroup);
    label(): string;
    setLabel(label: string): void;
}
