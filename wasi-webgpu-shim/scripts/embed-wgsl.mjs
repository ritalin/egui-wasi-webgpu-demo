import { readFile, writeFile } from "fs/promises";
import path from "path";

const root = process.cwd();

const wgslPath = path.join(root, "src/shader.wgsl");
const jsPath = wgslPath + ".js";

const content = await readFile(wgslPath, "utf8");

await writeFile(jsPath, `export default ${JSON.stringify(content)};\n`);
