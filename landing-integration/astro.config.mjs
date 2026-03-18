// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "../dist-final",
  base: "/egui-wasi-webgpu-demo/",
});
