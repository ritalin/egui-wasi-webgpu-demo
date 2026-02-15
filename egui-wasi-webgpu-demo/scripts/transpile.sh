#!/usr/bin/env bash

set -e -o pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

PROFILE_FLAG=""
PROFILE_DIR="debug"
OPTIMIZE=""

if [ "$1" == "release" ]; then
  PROFILE_FLAG="--release"
  PROFILE_DIR="release"
  OPTIMIZE="--optimize"
fi

(
    cd $BASE_DIR

    cargo build --target wasm32-wasip2 --manifest-path $BASE_DIR/pkg/wasi-renderer/Cargo.toml $PROFILE_FLAG

    pnpm exec jco transpile \
    --name egui-renderer \
    --out-dir pkg/_transpiled \
    --instantiation async \
    --no-nodejs-compat \
    $OPTIMIZE \
    $BASE_DIR/pkg/wasi-renderer/target/wasm32-wasip2/$PROFILE_DIR/wasi_renderer.wasm
)
