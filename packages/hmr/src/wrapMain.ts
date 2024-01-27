import {
  appInstDefaultId,
  initFuncId,
  localsObjId,
  mainFuncId,
} from "./constants";
import { ParseResult } from "./parser";

export function wrapMain({
  appCallAst,
  mainFuncAst,
  mainSrc,
  appInstName,
}: ParseResult) {
  const appId = appInstName ?? appInstDefaultId;

  mainSrc.update(
    appCallAst.start!,
    mainFuncAst.start!,
    `export const ${mainFuncId} = (${localsObjId}) => (`,
  );

  mainSrc.append(`
let ${appId}, ${localsObjId};

export function ${initFuncId}(__app_param__, __locals_param__) {
  ${appId} = __app_param__;
  ${localsObjId} = __locals_param__;
}

import.meta.hot?.accept(async (__new_main_mod__) => {
  __new_main_mod__.${initFuncId}(${appId}, ${localsObjId});
  const newMain = __new_main_mod__.${mainFuncId}(${localsObjId});
  if(${appId}.state !== "idle") {
    await ${appId}.promises.mainExecuted;
  }
  ${appId}.main = newMain;
  ${appId}.update();
});
`);
}
