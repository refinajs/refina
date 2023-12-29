import {
  appInstDeafultId,
  initFuncId,
  localsObjId,
  mainFuncId,
  mainUrlSuffix,
} from "./constants";
import { Binding } from "./getBindings";
import { ParseResult } from "./parse";

export function wrapLocals(
  mainpath: string,
  { appCallStart, mainStart, mainEnd, localsSrc }: ParseResult,
  bindings: Binding[],
  appInstance: string | null,
) {
  localsSrc.prepend(
    `import { ${mainFuncId}, ${initFuncId} } from ${JSON.stringify(
      mainpath + mainUrlSuffix,
    )};`,
  );

  let left = `\nconst ${localsObjId} = Object.seal({`;
  for (const { name, readonly } of bindings) {
    if (readonly) {
      left += `${name},`;
    } else {
      left += `get ${name}() { return ${name} },`;
      left += `set ${name}(v) { ${name} = v },`;
    }
  }
  if (appInstance) {
    left += `get ${appInstance}() { return ${appInstance} },`;
  }
  left += `});\n\n`;
  if (!appInstance) {
    left += `const ${appInstDeafultId} = `;
  }
  localsSrc.prependLeft(appCallStart, left);

  localsSrc.update(mainStart, mainEnd, `${mainFuncId}(${localsObjId})`);

  localsSrc.append(`
  ${initFuncId}(${appInstance ?? appInstDeafultId}, ${localsObjId});
`);
}
