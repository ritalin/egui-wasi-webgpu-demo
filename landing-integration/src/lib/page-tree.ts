import type { PageEntry } from "./asset-supports";

export interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
}

export function buildPageTree(pages: PageEntry[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const page of pages) {
    const parts = page.path.split("/");
    let nodes = root;

    for (let i = 0; i < parts.length; ++i) {
      const part = parts[i];
      let node = nodes.find((nd) => nd.name === part);
      if (!node) {
        node = { name: part, path: page.path };
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
