import type { PageEntry } from "./asset-supports";
import path from "node:path";

export interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
}

export function buildPageTree(pages: PageEntry[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const page of pages) {
    let nodes = root;

    const parts = [...page.prefix.split("/").filter((p) => p !== ""), page.path];
    const lastIndex = parts.length - 1;

    for (let i = 0; i < parts.length; ++i) {
      const part = parts[i];
      let node = nodes.find((nd) => nd.name === part);
      if (!node) {
        node = { name: part, path: page.isApp && i === lastIndex ? path.join(page.prefix, page.path) : "" };
        nodes.push(node);
      }

      if (i < parts.length - 1) {
        if (!node.children) {
          node.children = [];
        }
        nodes = node.children;
      }
    }
  }

  return root;
}
