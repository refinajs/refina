import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import _ from "lodash";

function generateComponent(
  componentFuncName: string,
  componentClassName: string,
  iconContent: string,
  width: string,
  viewBoxWidth: string,
) {
  const svgContent = [...iconContent.matchAll(/(?<= d=)".+?"/g)]
    .map(
      v => `_._svgPath({
        d: ${v},
        fill: "currentColor",
      })`,
    )
    .join(";\n      ");
  return `@FIcons.outputComponent("${componentFuncName}")
export class ${componentClassName} extends OutputComponent {
  main(_: Context): void {
    _._svgSvg(
      {
        width: "${width}",
        height: "${width}",
        viewBox: "0 0 ${viewBoxWidth} ${viewBoxWidth}",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
      } as any,
      () => {
        // @ts-ignore
        ${svgContent};
      },
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    ${componentFuncName}: ${componentClassName};
  }
}
`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const iconsDir = join(
  __dirname,
  "node_modules",
  "@fluentui",
  "svg-icons",
  "icons",
);
const distDir = join(__dirname, "dist");

if (
  fs.existsSync(distDir) &&
  fs.lstatSync(distDir).isDirectory() &&
  fs.readdirSync(distDir).length > 0
) {
  console.log(
    "Fluentui-icons dist directory is not empty, generating is skipped.",
  );
  process.exit(0);
}

const contents = fs.readdirSync(iconsDir);
const contentPaths = contents.map(v => join(iconsDir, v));
const fileNames: string[] = [];
const filePaths = contentPaths.filter((v, i) => {
  if (fs.lstatSync(v).isFile() && contents[i].endsWith(".svg")) {
    fileNames.push(contents[i].slice(0, -4));
    return true;
  }
  return false;
});

fs.mkdirSync(distDir, { recursive: true });

const components: Record<string, string[]> = {};

fileNames.forEach((fileName, index) => {
  const sourceFilePath = filePaths[index];

  const fileNameParts = fileName.split("_");
  const snakeIconName = fileNameParts.slice(0, -2).join("_");
  const [iconSize, iconType] = fileNameParts.slice(-2);

  const lowerCamelIconName = _.camelCase(snakeIconName);
  const upperCamelIconFullName = _.upperFirst(_.camelCase(fileName));
  const componentFuncName = `fi${upperCamelIconFullName}`;
  const componentClassName = `FI${upperCamelIconFullName}`;

  const iconContent = fs.readFileSync(sourceFilePath, { encoding: "utf8" });
  const width = [...iconContent.matchAll(/(?<= width=").+?(?=")/g)][0][0];

  components[lowerCamelIconName] ??= [];
  components[lowerCamelIconName].push(
    generateComponent(
      componentFuncName,
      componentClassName,
      iconContent,
      width,
      width,
    ),
  );

  if (iconSize == "20") {
    const lowerCamelIconName = _.camelCase(snakeIconName);
    const upperCamelIconFullName = _.upperFirst(
      _.camelCase(snakeIconName + "_" + iconType),
    );
    const componentFuncName = `fi${upperCamelIconFullName}`;
    const componentClassName = `FI${upperCamelIconFullName}`;

    const iconContent = fs.readFileSync(sourceFilePath, { encoding: "utf8" });

    components[lowerCamelIconName] = [
      generateComponent(
        componentFuncName,
        componentClassName,
        iconContent,
        "1em",
        "20",
      ),
      ...components[lowerCamelIconName],
    ];
  }

  console.log(
    `generating: ${index + 1}/${fileNames.length}: ${lowerCamelIconName}`,
  );
});

const componentsEntries = Object.entries(components);
componentsEntries.forEach(([lowerCamelIconName, codes], index) => {
  const code =
    `import { Context, OutputComponent } from "refina";
import FIcons from "../plugin";\n\n` + codes.join("\n");
  const outputFileName = `${lowerCamelIconName}.r.ts`;
  const outputFilePath = join(distDir, outputFileName);
  fs.writeFileSync(outputFilePath, code);
  console.log(
    `outputing: ${index + 1}/${
      componentsEntries.length
    }: ${lowerCamelIconName}`,
  );
});
