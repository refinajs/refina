export default (tailwind: boolean, mdui: boolean) =>
  (mdui ? `@import url(@refina/mdui/styles.css);\n\n` : ``) +
  (tailwind
    ? `${mdui ? `` : `@tailwind base;\n`}
@tailwind components;
@tailwind utilities;
`
    : `\n`);
