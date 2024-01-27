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
  bindings: Bindings,
) {
  localsSrc.prepend(
    `import { ${mainFuncId}, ${initFuncId} } from ${JSON.stringify(
      srcPath + mainUrlSuffix,
    )};`,
  );

  let left = `\nconst ${localsObjId} = Object.seal({`;
  for (const [name, readonly] of Object.entries(bindings)) {
    if (readonly) {
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
