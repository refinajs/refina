export const localsObjId = "__locals__";
export function getLocalsAccessor(id: string) {
  return `(${localsObjId}.${id})`;
}

export const mainFuncId = "__main__";

export const appInstDefaultId = "__app__";

export const initFuncId = "__init__";

export const mainUrlSuffix = "?refina-app-main";
