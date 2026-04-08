import { defineConfig, UserConfig } from "vite";
import * as path from "node:path";

export function createViteConfig(appName: string): UserConfig {
  return defineConfig({
    base: process.env.NODE_ENV === "production" ? `/egui-wasi-webgpu-demo/examples/${appName}/` : "/",
    build: {
      emptyOutDir: true,
      outDir: `../dist/examples/${appName}`,
    },
    resolve: {
      alias: {
        "pkg/egui-renderer": path.resolve(__dirname, `./pkg/${appName}/_transpiled/egui-renderer`),
        "/pkg/interfaces": path.resolve(__dirname, `./pkg/${appName}/_transpiled/interfaces`),
      },
    },
  });
}
