import fs from "fs";
import path from "path";
import prompts from "prompts";
import basicsApp from "./templates/app/basics";
import basicsMduiApp from "./templates/app/basics+mdui";
import intrinsicApp from "./templates/app/intrinsic";
import mduiApp from "./templates/app/mdui";
import extensionsRaw from "./templates/extensions";
import gitignoreRaw from "./templates/gitignore";
import baseHTML from "./templates/html/base";
import mduiHeader from "./templates/html/mdui";
import tailwindHead from "./templates/html/tailwind";
import postcssConfigRaw from "./templates/postcssConfig";
import prettierrcRaw from "./templates/prettierrc";
import settingsRaw from "./templates/settings";
import tailwindConfigRaw from "./templates/tailwindConfig";
import tsconfigRaw from "./templates/tsconfig";
import viteConfigRaw from "./templates/viteConfig";
import { banner } from "./utils/banner";
import { isValidPackageName, toValidPackageName } from "./utils/pkgName";
import readmeRaw from "./templates/readme";
import chalk from "chalk";
import { packageManager, runCommand } from "./utils/pkgManager";

async function main() {
  console.log();
  console.log(banner);
  console.log();

  const cwd = process.cwd();

  let targetDir = process.argv.slice(2)[0];
  const defaultProjectName = !targetDir ? "refina-project" : targetDir;
  const getRoot = () => path.join(cwd, targetDir);

  const input = await prompts(
    [
      {
        name: "projectName",
        type: targetDir ? null : "text",
        message: "Project name:",
        initial: defaultProjectName,
        onState: state =>
          (targetDir = String(state.value).trim() || defaultProjectName),
        validate: () =>
          !fs.existsSync(getRoot()) ||
          "Target directory already exists, please choose another name",
      },
      {
        name: "packageName",
        type: () => (isValidPackageName(targetDir) ? null : "text"),
        message: "Package name:",
        initial: () => toValidPackageName(targetDir),
        validate: dir => isValidPackageName(dir) || "Invalid package.json name",
      },
      {
        name: "components",
        type: "multiselect",
        message: "Component libraries to install:",
        choices: [
          { title: "@refina/basic-components", selected: true },
          { title: "@refina/mdui", selected: true },
        ],
        instructions: false,
        hint: "- Space to select. Return to submit",
      },
      {
        name: "useTailwind",
        type: "toggle",
        message: "Add TailwindCSS for styling?",
        initial: true,
        active: "Yes",
        inactive: "No",
      },
      {
        name: "usePrettier",
        type: "toggle",
        message: "Add Prettier for code formatting?",
        initial: true,
        active: "Yes",
        inactive: "No",
      },
    ],
    {
      onCancel: () => {
        console.log();
        console.log(chalk.red("×") + ` Aborted.`);
        console.log();
        process.exit(1);
      },
    },
  );

  const root = getRoot();

  console.log();
  console.log(`Scaffolding project in ${root}...`);

  fs.mkdirSync(root, { recursive: true });
  process.chdir(root);

  type Dependency = [name: string, version: string];
  const dependencies: Dependency[] = [["refina", "^0.1.0"]];
  const devDependencies: Dependency[] = [
    ["vite", "^4.4.0"],
    ["typescript", "^5.3.0"],
    ["@refina/tsconfig", "^0.1.0"],
    ["vite-plugin-refina", "^0.1.0"],
  ];
  const toDepObject = (dependencies: Dependency[]) =>
    Object.fromEntries(
      dependencies.sort(([name1], [name2]) => name1.localeCompare(name2)),
    );

  if (input.components.includes(0)) {
    dependencies.push(["@refina/basic-components", "^0.1.0"]);
  }
  if (input.components.includes(1)) {
    dependencies.push(["@refina/mdui", "^0.1.0"]);
  }
  if (input.useTailwind) {
    devDependencies.push(["tailwindcss", "^3.3.3"]);
    devDependencies.push(["autoprefixer", "^10.4.15"]);
    devDependencies.push(["postcss", "^8.4.27"]);
  }
  if (input.usePrettier) {
    devDependencies.push(["prettier", "^3.0.0"]);
  }

  const packageJsonRaw = JSON.stringify(
    {
      name: input.packageName ?? targetDir,
      version: "0.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        check: "tsc --noEmit",
        prettier: input.usePrettier ? "prettier --write ." : undefined,
      },
      dependencies: toDepObject(dependencies),
      devDependencies: toDepObject(devDependencies),
    },
    null,
    2,
  );
  fs.writeFileSync("package.json", packageJsonRaw);

  fs.writeFileSync("vite.config.ts", viteConfigRaw);

  fs.writeFileSync("tsconfig.json", tsconfigRaw);

  fs.writeFileSync(".gitignore", gitignoreRaw);

  fs.writeFileSync(
    "README.md",
    readmeRaw(input.projectName, input.useTailwind, input.usePrettier),
  );

  if (input.useTailwind) {
    fs.writeFileSync("tailwind.config.ts", tailwindConfigRaw);
    fs.writeFileSync("postcss.config.js", postcssConfigRaw);
  }

  if (input.usePrettier) {
    fs.writeFileSync(".prettierrc", prettierrcRaw);
  }

  let head = "";
  if (input.components.includes(1)) {
    head += mduiHeader;
  }
  if (input.useTailwind) {
    head += tailwindHead(input.components.includes(1));
  }
  fs.writeFileSync("index.html", baseHTML(head));

  fs.mkdirSync("src");

  fs.writeFileSync(
    "src/app.r.ts",
    input.components.includes(0)
      ? input.components.includes(1)
        ? basicsMduiApp(input.useTailwind)
        : basicsApp(input.useTailwind)
      : input.components.includes(1)
      ? mduiApp(input.useTailwind)
      : intrinsicApp(input.useTailwind),
  );

  fs.mkdirSync(".vscode");

  const extensionsJson = extensionsRaw(input.useTailwind, input.usePrettier);
  if (extensionsJson !== null) {
    fs.writeFileSync(".vscode/extensions.json", extensionsJson);
  }

  fs.writeFileSync(
    ".vscode/settings.json",
    settingsRaw(input.useTailwind, input.usePrettier),
  );

  console.log();
  console.log("Done. Now run:");
  console.log();
  console.log(chalk.bold.green(`  cd ${targetDir}`));
  console.log(chalk.bold.green(`  ${packageManager} install`));
  console.log(chalk.bold.green(`  ${runCommand} dev`));
  console.log();
}

main();
