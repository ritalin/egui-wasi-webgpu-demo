import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/egui-wasi-webgpu-demo/demo" : "/",
  build: {
    outDir: "../dist/demo",
  },
  resolve: {
    alias: {
      "pkg/egui-renderer": path.resolve(__dirname, "./pkg/_transpiled/egui-renderer"),
      "/pkg/interfaces": path.resolve(__dirname, "./pkg/_transpiled/interfaces"),
    },
  },
});
