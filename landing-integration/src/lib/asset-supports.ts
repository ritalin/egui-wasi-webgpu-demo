import fs from "node:fs/promises";
import path from "node:path";

export async function getAssets(name: string): Promise<{ js: string; css: string[] }> {
  const dirPath = path.resolve(`../dist/${name}/assets`);
  const files = await fs.readdir(dirPath);

  const js = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const css = files.filter((f) => f.endsWith(".css"));

  if (js == undefined || css.length == 0) {
    throw new Error(`Entry not found in ${dirPath}`);
  }

  return { js, css };
}

export interface PageEntry {
  prefix: string;
  path: string;
  isApp: boolean;
}

export async function getPagesFromDist(): Promise<PageEntry[]> {
  const pages: PageEntry[] = [];

  async function rec(baseDirPth: string, prefix: string, name: string) {
    if (prefix === ".") prefix = "";

    const fullpath = path.join(baseDirPth, prefix, name);
    if (!(await fs.stat(fullpath)).isDirectory()) return;
    const entries = await fs.readdir(fullpath, { withFileTypes: true });

    if (entries.some((f) => f.isDirectory() && f.name === "assets")) {
      pages.push({ prefix, path: name, isApp: true });
      return;
    }
    if (name !== "") {
      pages.push({ prefix, path: name, isApp: false });
    }

    for (const subdir of entries) {
      await rec(baseDirPth, path.join(prefix, name), subdir.name);
    }
  }

  const dirPath = path.resolve(`../dist`);
  await rec(dirPath, "", "");

  return pages;
}
