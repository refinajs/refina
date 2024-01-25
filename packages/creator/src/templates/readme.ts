import { packageManager, runCommand } from "../utils/pkgManager";

export default (projectName: string, tailwind: boolean, prettier: boolean) => {
  let extensionsInfo = "";
  if (tailwind || prettier) {
    extensionsInfo = ` with the following extensions:\n`;
  }
  if (tailwind) {
    extensionsInfo += `\n- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)`;
  }
  if (prettier) {
    extensionsInfo += `\n- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)`;
  }

  return `# ${projectName}

This template should help get you started developing with [Refina](https://github.com/refinajs/refina) in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/)${extensionsInfo}

## Project Setup

\`\`\`sh
${packageManager} install
\`\`\`

### Compile and Hot-Reload for Development

\`\`\`sh
${runCommand} dev
\`\`\`

### Type-Check

\`\`\`sh
${runCommand} check
\`\`\`

### Compile and Minify for Production

\`\`\`sh
${runCommand} build
\`\`\`
${
  prettier
    ? `
### Format Code

\`\`\`sh
${runCommand} format
\`\`\`
`
    : ""
}`;
};
