import { argv } from "node:process";
import { listWorkspaceMembers, runCmd, runScript, runAll } from "../tools/run-build.ts";

async function main() {
  const args = argv.slice(2);
  let members: string[];

  if (args.length > 0) {
    members = [args[0]];
  } else {
    members = await listWorkspaceMembers("./pkg/Cargo.toml");
  }
  console.log("Members:", members);

  await runAll(members, async (app) => {
    await runScript(app, "build:pkg", [app, "release"]);
    await runCmd(app, "tsc", ["-p", `./pkg/${app}/tsconfig.json`]);
    await runCmd(app, "vite", ["build", "-c", `./pkg/${app}/vite.config.ts`]);
  });

  console.info("All build finished");
}

main();
