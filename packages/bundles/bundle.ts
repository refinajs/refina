import * as fsWalk from "@nodelib/fs.walk";
import { RefinaTransformer } from "@refina/transformer";
import { consola } from "consola";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rimrafSync } from "rimraf";

consola.start("Starting bundle Refina libs...");

const libs = ["basic-components", "core", "mdui", "transformer"];
const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");

const transformer = new RefinaTransformer();

for (const lib of libs) {
  try {
    const sourceDir = join(__dirname, "..", lib, "src");
    const tempDir = join(__dirname, "..", lib, "dist");

    rimrafSync(tempDir);

    const entries = fsWalk.walkSync(sourceDir, {
      basePath: ".",
    });

    for (const entry of entries) {
      if (entry.dirent.isFile()) {
        const sourcePath = resolve(sourceDir, entry.path);
        const tempPath = resolve(tempDir, entry.path);

        const source = readFileSync(sourcePath, "utf-8");
        const transformed =
          transformer.transformFile(entry.name, source, true)?.code ?? source;

        mkdirSync(dirname(tempPath), { recursive: true });
        writeFileSync(tempPath, transformed);
      }
    }
  } catch (e) {
    consola.error(e);
    throw e;
  }

  consola.success(`Transformed ${lib}!`);
}

const command = (minify: boolean) =>
  [
    `pnpm exec tsup`,
    ...libs.map(
      lib => `--entry.${lib}${minify ? "_min" : ""} ../${lib}/dist/index.ts`,
    ),
    `--format esm -d ./dist --no-splitting --sourcemap`,
    `--define.import.meta.env.DEV false`,
    minify ? `--minify terser` : `--clean`,
  ].join(" ");

execSync(command(false), {
  stdio: "inherit",
  cwd: __dirname,
});

execSync(command(true), {
  stdio: "inherit",
  cwd: __dirname,
});

const distEntries = fsWalk.walkSync(distDir, { basePath: "." });
for (const entry of distEntries) {
  if (entry.dirent.isFile()) {
    if (!entry.name.includes("_min")) continue;
    renameSync(
      resolve(distDir, entry.path),
      resolve(distDir, entry.path.replace(/_min/, ".min")),
    );
  }
}

consola.success("Bundling complete!");
