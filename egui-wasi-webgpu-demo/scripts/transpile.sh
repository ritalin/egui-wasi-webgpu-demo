#!/usr/bin/env bash

set -e -o pipefail

PROFILE_FLAG=""
PROFILE_DIR="debug"
OPTIMIZE=""

if [ "$1" == "release" ]; then
  PROFILE_FLAG="--release"
  PROFILE_DIR="release"
  OPTIMIZE="--optimize"
fi

cargo build --target wasm32-wasip2 --manifest-path ./pkg/wasi-renderer/Cargo.toml $PROFILE_FLAG

pnpm exec jco transpile \
  --name egui-renderer \
  --out-dir pkg/_transpiled \
  --instantiation async \
  --no-nodejs-compat \
  $OPTIMIZE \
  pkg/wasi-renderer/target/wasm32-wasip2/$PROFILE_DIR/wasi_renderer.wasm
