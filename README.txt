# egui ♡ wasi:webgpu demo

An experimental marriage of **egui** (immediate mode UI) and **wasi:webgpu** (the next-gen standard).

A cutting-edge demonstration of egui running on WASI Preview2 and rendering via wasi:webgpu.
This project leverages the WebAssembly Component Model to bridge Rust-based UI with native browser GPU capabilities.

## prerequests

- Rust: latest (recommended)
    - Target: wasm32-wasip2 (Install via rustup target add wasm32-wasip2)
- pnpm: latest (recommended)
- Browser: A browser with WebGPU support and WebAssembly Component Model capability enabled.

## Getting started

1. Install Dependencies

```bash
pnpm install
```

2. Build everything (Shim, WASM, TS, and Vite) in one go

```bash
pnpm -r build
```

3. Preview the demo

```
pnpm run -F egui-wasi-webgpu-demo preview
```
