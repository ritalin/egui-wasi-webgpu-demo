import { AbstractBuffer } from "./abstract-buffer.js";
export declare class Context {
    constructor();
    getCurrentBuffer(): AbstractBuffer;
    present(): void;
}
