import {
  appInstDeafultId,
  initFuncId,
  localsObjId,
  mainFuncId,
} from "./constants";
import { ParseResult } from "./parser";

export function wrapMain({ imports, mainSrc }: ParseResult) {
  mainSrc.prepend(`${imports}
export const ${mainFuncId} = (${localsObjId}) => `);

  mainSrc.append(`
let ${appInstDeafultId}, ${localsObjId};

export function ${initFuncId}(app, locals) {
  ${appInstDeafultId} = app;
  ${localsObjId} = locals;
}

import.meta.hot?.accept(async (newMainModule) => {
  newMainModule.${initFuncId}(${appInstDeafultId}, ${localsObjId});
  const newMain = newMainModule.${mainFuncId}(${localsObjId});
  if(${appInstDeafultId}.state !== "idle") {
    await ${appInstDeafultId}.promises.mainExecuted;
  }
  ${appInstDeafultId}.main = newMain;
   ${appInstDeafultId}.update();
});
`);
}
