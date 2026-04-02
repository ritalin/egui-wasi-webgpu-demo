#!/usr/bin/env bash

set -e0 pipefail

pnpm exec jco types ./pkg/wit/interaction.wit -o ./src/types/interaction
pnpm exec jco types ../egui-wasi-webgpu-demo/pkg/wit/renderer --world-name immediate-renderer-types-world -o ./src/types/event
