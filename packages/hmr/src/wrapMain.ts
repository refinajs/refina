import type MagicString from "magic-string";
import {
  appInstDeafultId,
  initFuncId,
  localsObjId,
  mainFuncId,
} from "./constants";

export function wrapMain(mainSrc: MagicString) {
  mainSrc.prepend(`export const ${mainFuncId} = (${localsObjId}) => `);
  mainSrc.append(`
let ${appInstDeafultId}, ${localsObjId};

export function ${initFuncId}(app, locals) {
  ${appInstDeafultId} = app;
  ${localsObjId} = locals;
}

if (import.meta.hot) {
  import.meta.hot.accept((newMainModule) => {
    newMainModule.${initFuncId}(${appInstDeafultId}, ${localsObjId});
    const newMain = newMainModule.${mainFuncId}(${localsObjId});
    if(${appInstDeafultId}.state !== "idle") {
      ${appInstDeafultId}.promises.mainExecuted.then(() => {
        ${appInstDeafultId}.main = newMain;
        ${appInstDeafultId}.update();
      })
    } else {
      ${appInstDeafultId}.main = newMain;
      ${appInstDeafultId}.update();
    }
  });
}
`);
}
