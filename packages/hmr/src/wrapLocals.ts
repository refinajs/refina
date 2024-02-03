import MagicString from "magic-string";
import {
  appInstDefaultId,
  initFuncId,
  localsObjId,
  mainFuncId,
  mainUrlSuffix,
} from "./constants";
import { Decls } from "./getDecls";
import { ParseResult } from "./parser";

export function wrapLocals(
  { appStmt, mainFuncExpr, appInstName }: ParseResult,
  localsSrc: MagicString,
  srcPath: string,
  bindings: Decls,
) {
  localsSrc.prepend(
    `import { ${mainFuncId}, ${initFuncId} } from ${JSON.stringify(
      srcPath + mainUrlSuffix,
    )};`,
  );

  let left = `\nconst ${localsObjId} = Object.seal({`;

  const sortedNames = Object.keys(bindings).sort();
  for (const name of sortedNames) {
    if (bindings[name].readonly) {
      left += `  ${name},\n`;
    } else {
      left += `  get ${name}() { return ${name} },\n`;
      left += `  set ${name}(v) { ${name} = v },\n`;
    }
  }
  left += `});\n\n`;
  if (!appInstName) {
    left += `const ${appInstDefaultId} = `;
  }
  localsSrc.prependLeft(appStmt.start!, left);

  localsSrc.update(
    mainFuncExpr.start!,
    mainFuncExpr.end!,
    `${mainFuncId}(${localsObjId})`,
  );

  localsSrc.append(`
  ${initFuncId}(${appInstName ?? appInstDefaultId}, ${localsObjId});
`);
}
