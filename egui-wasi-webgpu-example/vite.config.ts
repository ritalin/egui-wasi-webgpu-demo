import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/egui-wasi-webgpu-demo/examples/hello_world/" : "/",
  build: {
    outDir: "../dist/examples/hello_world",
  },
  resolve: {
    alias: {
      "pkg/egui-renderer": path.resolve(__dirname, "./pkg/hello_world/_transpiled/egui-renderer"),
      "/pkg/interfaces": path.resolve(__dirname, "./pkg/hello_world/_transpiled/interfaces"),
    },
  },
});
