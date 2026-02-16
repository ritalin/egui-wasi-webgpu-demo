import peer = globalThis;
import { GpuBindGroup } from "./gpu-bind-group.js";
import { GpuBuffer } from "./gpu-buffer.js";
import { GpuComputePipeline } from "./gpu-compute-pipeline.js";
import type { GpuIndex32, GpuSize32, GpuSize64 } from "../../types/wasi-webgpu-webgpu.js";
export declare class GpuComputePassEncoder {
    private readonly _handle;
    constructor(_handle: peer.GPUComputePassEncoder);
    setPipeline(pipeline: GpuComputePipeline): void;
    dispatchWorkgroups(workgroupCountX: GpuSize32, workgroupCountY: GpuSize32 | undefined, workgroupCountZ: GpuSize32 | undefined): void;
    dispatchWorkgroupsIndirect(indirectBuffer: GpuBuffer, indirectOffset: GpuSize64): void;
    end(): void;
    label(): string;
    setLabel(label: string): void;
    pushDebugGroup(groupLabel: string): void;
    popDebugGroup(): void;
    insertDebugMarker(markerLabel: string): void;
    setBindGroup(index: GpuIndex32, bindGroup: GpuBindGroup | undefined, dynamicOffsetsData: Uint32Array | undefined, dynamicOffsetsDataStart: GpuSize64 | undefined, dynamicOffsetsDataLength: GpuSize32 | undefined): void;
}
