import { AbstractBuffer } from "./abstract-buffer.js";
// origin: src/types/wasi-graphics-context-graphics-context.d.ts:10
export class Context {
    // origin: src/types/wasi-graphics-context-graphics-context.d.ts:11
    constructor(){
        console.error("(Todo)", 'Context.constructor(...)');
    }
    // origin: src/types/wasi-graphics-context-graphics-context.d.ts:12
    getCurrentBuffer(): AbstractBuffer {
        console.error('(Todo)', 'Context.getCurrentBuffer(...)');
        return undefined as any;
    }
    // origin: src/types/wasi-graphics-context-graphics-context.d.ts:16
    present(): void {
        console.error('(Todo)', 'Context.present(...)');
        return undefined as any;
    }
}
