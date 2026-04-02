#!/usr/bin/env bash

set -e -o pipefail

PKG_NAME="$1"

pnpm exec vite -c "./pkg/$PKG_NAME/vite.config.ts"
