import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "egui-renderer": path.resolve(
        __dirname,
        "./pkg/_transpiled/egui-renderer",
      ),
    },
  },
});
