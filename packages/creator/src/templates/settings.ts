export default (tailwind: boolean, prettier: boolean) =>
  JSON.stringify(
    {
      "editor.guides.bracketPairs": "active",
      "editor.quickSuggestions": tailwind
        ? {
            strings: "on",
          }
        : undefined,
      "tailwindCSS.experimental.classRegex": tailwind
        ? [
            ["\\$cls`([\\s\\S]*?)`", "(\\S+)"],
            ["\\$cls\\(([^\\)]*)\\)", '\\"(.*?)\\"'],
            ["\\$cls\\(([^\\)]*)\\)", "`(.*?)`"],
            ["addCls\\(([^\\)]*)\\)", '\\"(.*?)\\"'],
            ["addCls\\(([^\\)]*)\\)", "`(.*?)`"],
            ["\\$clsFunc`([\\s\\S]*?)`", "(\\S+)"],
            ["\\$clsFunc\\(([^\\)]*)\\)", '\\"(.*?)\\"'],
            ["\\$clsStr`([\\s\\S]*?)`", "(\\S+)"],
            ["\\$clsStr\\(([^\\)]*)\\)", '\\"(.*?)\\"'],
          ]
        : undefined,
      "editor.defaultFormatter": prettier
        ? "esbenp.prettier-vscode"
        : undefined,
    },
    null,
    2,
  );
