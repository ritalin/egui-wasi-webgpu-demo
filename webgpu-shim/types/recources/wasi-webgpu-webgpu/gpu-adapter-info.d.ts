import peer = globalThis;
export declare class GpuAdapterInfo {
    private readonly _handle;
    constructor(_handle: peer.GPUAdapterInfo);
    vendor(): string;
    architecture(): string;
    device(): string;
    description(): string;
    subgroupMinSize(): number;
    subgroupMaxSize(): number;
}
