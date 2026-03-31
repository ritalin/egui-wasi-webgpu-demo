#!/usr/bin/env bash

set -e -o pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

PKG_NAME="$1"
PROFILE_FLAG=""
PROFILE_DIR="debug"
OPTIMIZE=""

if [ "$2" == "release" ]; then
  PROFILE_FLAG="--release"
  PROFILE_DIR="release"
  OPTIMIZE="--optimize"
fi

(
    cd $BASE_DIR

    cargo build --target wasm32-wasip2 --manifest-path "$BASE_DIR/pkg/Cargo.toml" -p $PKG_NAME $PROFILE_FLAG

    pnpm exec jco transpile \
    --name egui-renderer \
    --out-dir "pkg/$PKG_NAME/_transpiled" \
    --instantiation async \
    --no-nodejs-compat \
    $OPTIMIZE \
    "$BASE_DIR/pkg/target/wasm32-wasip2/$PROFILE_DIR/$PKG_NAME.wasm"
)
