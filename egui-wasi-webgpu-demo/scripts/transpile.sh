#!/usr/bin/env bash

set -e -o pipefail

cargo build --target wasm32-wasip2 --manifest-path ./pkg/wasi-renderer/Cargo.toml

pnpm exec jco transpile \
  --name egui-renderer \
  --out-dir pkg/_transpiled \
  --instantiation async \
  --no-nodejs-compat \
  pkg/wasi-renderer/target/wasm32-wasip2/debug/wasi_renderer.wasm
