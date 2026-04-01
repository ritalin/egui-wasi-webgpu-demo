import os from "node:os";
import path from "node:path";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function getConcurrency(): number {
  return Math.max(1, Math.floor(os.cpus().length * 0.75));
}

export async function listWorkspaceMembers(manifestPath: string): Promise<string[]> {
  const { stdout } = await execAsync(`cargo metadata --manifest-path ${manifestPath} --no-deps --format-version 1`);
  const metadata = JSON.parse(stdout);
  return metadata.workspace_members.map((m: string) => stem(m)).filter((m: string) => m !== "example_core");
}

export function runCmd(app: string, cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["exec", cmd, ...args], { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed/task: ${cmd}, app: ${app}`)),
    );
    child.on("error", reject);
  });
}

export function runScript(app: string, cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["run", cmd, ...args], { stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Script failed/task: ${cmd}, app: ${app}`))));
    child.on("error", reject);
  });
}

export async function runAll(members: string[], callback: (app: string) => Promise<void>): Promise<void> {
  const concurrency = getConcurrency();
  console.log("Using", concurrency, "cores");

  const queue = [...members];
  const active: Promise<void>[] = [];

  while (queue.length > 0 || active.length > 0) {
    while (active.length < concurrency && queue.length > 0) {
      const app = queue.shift();
      if (app) {
        console.info(`Building: ${app}`);
        const p = callback(app).finally(() => {
          const i = active.indexOf(p);
          if (i >= 0) active.splice(i, 1);
        });
        active.push(p);
      }
      await Promise.race(active);
    }
  }
}

function stem(member: string): string {
  const part = member.split("+file://")[1].split("#")[0];
  return path.basename(part);
}
