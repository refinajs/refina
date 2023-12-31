import type { SourceMap } from "magic-string";
import { Binding } from "./getBindings";

export const localsObjId = "__locals__";
export function getLocalsAccessor(id: string) {
  return `(${localsObjId}.${id})`;
}

export const mainFuncId = "__main__";

export const appInstDeafultId = "__app__";

export const initFuncId = "__init__";

export const mainUrlSuffix = "?refina-app-main";

interface TransformResult {
  raw: string;
  code: string;
  map: SourceMap;
}

export interface RefinaDescriptor {
  mainStart: number;
  mainEnd: number; // negative

  bindings: Binding[];

  locals: TransformResult;

  main: TransformResult;
}

export const cache = new Map<string, RefinaDescriptor | null>();
