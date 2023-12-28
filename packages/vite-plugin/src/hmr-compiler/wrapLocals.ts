import {
  appInstId,
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
  left += `});\n\nconst ${appInstId} = `;
  localsSrc.prependLeft(appCallStart, left);

  localsSrc.update(mainStart, mainEnd, `${mainFuncId}(${localsObjId})`);

  localsSrc.append(`
  ${initFuncId}(${appInstId}, ${localsObjId});
`);
}

/*
if (import.meta.hot) {
  import.meta.hot.accept(${JSON.stringify(
    slash("/@fs/" + mainpath),
  )}, (newMainModule) => {
    const newMain = newMainModule.${mainFuncId}(${localsObjId});
    if(${appInstId}.state !== "idle") {
      ${appInstId}.promises.mainExecuted.then(() => {
        ${appInstId}.main = newMain;
        ${appInstId}.update();
      })
    } else {
      ${appInstId}.main = newMain;
      ${appInstId}.update();
    }
  });
}
*/
