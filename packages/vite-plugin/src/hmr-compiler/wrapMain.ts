import type MagicString from "magic-string";
import { appInstId, initFuncId, localsObjId, mainFuncId } from "./constants";

export function wrapMain(mainSrc: MagicString) {
  mainSrc.prepend(`export const ${mainFuncId} = (${localsObjId}) => `);
  mainSrc.append(`
let ${appInstId}, ${localsObjId};

export function ${initFuncId}(app, locals) {
  ${appInstId} = app;
  ${localsObjId} = locals;
}

if (import.meta.hot) {
  import.meta.hot.accept((newMainModule) => {
    newMainModule.${initFuncId}(${appInstId}, ${localsObjId});
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
`);
}
