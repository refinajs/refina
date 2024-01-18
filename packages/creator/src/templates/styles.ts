export default (tailwind: boolean, mdui: boolean) =>
  (mdui ? `@import url(@refina/mdui/styles.css);\n` : ``) +
  (tailwind
    ? (mdui ? `` : `@tailwind base;\n`) +
      `@tailwind components;\n@tailwind utilities;\n`
    : `\n`);
