import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/egui-wasi-webgpu-demo/" : "/",
  resolve: {
    alias: {
      "egui-renderer": path.resolve(
        __dirname,
        "./pkg/_transpiled/egui-renderer",
      ),
    },
  },
});
