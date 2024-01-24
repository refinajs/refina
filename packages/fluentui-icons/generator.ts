import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import _ from "lodash";

function generateComponent(
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
  return `export class ${componentClassName} extends Component {
  $main() {
    _._svgSvg(
      {
        width: "${width}",
        height: "${width}",
        viewBox: "0 0 ${viewBoxWidth} ${viewBoxWidth}",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
      } as any,
      () => {
        ${svgContent};
      },
    );
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
  process.argv[2] !== "--force" &&
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
  const componentClassName = `Fi${upperCamelIconFullName}`;

  const iconContent = fs.readFileSync(sourceFilePath, { encoding: "utf8" });
  const width = [...iconContent.matchAll(/(?<= width=").+?(?=")/g)][0][0];

  components[lowerCamelIconName] ??= [];
  components[lowerCamelIconName].push(
    generateComponent(componentClassName, iconContent, width, width),
  );

  if (iconSize == "20") {
    const lowerCamelIconName = _.camelCase(snakeIconName);
    const upperCamelIconFullName = _.upperFirst(
      _.camelCase(snakeIconName + "_" + iconType),
    );
    const componentClassName = `Fi${upperCamelIconFullName}`;

    const iconContent = fs.readFileSync(sourceFilePath, { encoding: "utf8" });

    components[lowerCamelIconName] = [
      generateComponent(componentClassName, iconContent, "1em", "20"),
      ...components[lowerCamelIconName],
    ];
  }

  console.log(
    `generating: ${index + 1}/${fileNames.length}: ${lowerCamelIconName}`,
  );
});

const componentsEntries = Object.entries(components);
componentsEntries.forEach(([lowerCamelIconName, codes], index) => {
  const code = `import { Component, _ } from "refina";\n\n` + codes.join("\n");
  const outputFileName = `${lowerCamelIconName}.ts`;
  const outputFilePath = join(distDir, outputFileName);
  fs.writeFileSync(outputFilePath, code);
  console.log(
    `outputing: ${index + 1}/${
      componentsEntries.length
    }: ${lowerCamelIconName}`,
  );
});
