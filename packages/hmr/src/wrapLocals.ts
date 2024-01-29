import {
  appInstDefaultId,
  initFuncId,
  localsObjId,
  mainFuncId,
  mainUrlSuffix,
} from "./constants";
import { Bindings } from "./getBindings";
import { ParseResult } from "./parser";

export function wrapLocals(
  { appCallAst, mainFuncAst, localsSrc, appInstName }: ParseResult,
  srcPath: string,
  usedBindings: Bindings,
  bindings: Bindings,
) {
  localsSrc.prepend(
    `import { ${mainFuncId}, ${initFuncId} } from ${JSON.stringify(
      srcPath + mainUrlSuffix,
    )};`,
  );

  let left = `\nconst ${localsObjId} = Object.seal({`;
  const sortedBindingNames = Object.keys(usedBindings).sort();
  for (const name of sortedBindingNames) {
    if (bindings[name]) {
      left += `  ${name},\n`;
    } else {
      left += `  get ${name}() { return ${name} },\n`;
      if (!usedBindings[name]) {
        left += `  set ${name}(v) { ${name} = v },\n`;
      }
    }
  }
  left += `});\n\n`;
  if (!appInstName) {
    left += `const ${appInstDefaultId} = `;
  }
  localsSrc.prependLeft(appCallAst.start!, left);

  localsSrc.update(
    mainFuncAst.start!,
    mainFuncAst.end!,
    `${mainFuncId}(${localsObjId})`,
  );

  localsSrc.append(`
  ${initFuncId}(${appInstName ?? appInstDefaultId}, ${localsObjId});
`);
}
