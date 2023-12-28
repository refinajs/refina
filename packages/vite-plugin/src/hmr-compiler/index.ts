import { SourceMap } from "magic-string";
import { getBindings } from "./getBindings";
import { parse } from "./parse";
import { processExpr } from "./process";
import { wrapLocals } from "./wrapLocals";
import { wrapMain } from "./wrapMain";

export interface RefinaDescriptor {
  localsContent: string;
  localsMap: SourceMap;
  mainContent: string;
  mainMap: SourceMap;
}

export function compile(
  src: string,
  mainpath: string,
): false | RefinaDescriptor {
  const parseResult = parse(src);
  if (parseResult === false) return false;
  const bindings = getBindings(parseResult);
  wrapLocals(mainpath, parseResult, bindings);
  processExpr(
    parseResult.mainAst,
    parseResult.mainSrc,
    new Set(bindings.map(b => b.name)),
  );
  wrapMain(parseResult);
  return {
    localsContent: parseResult.localsSrc.toString(),
    localsMap: parseResult.localsSrc.generateMap(),
    mainContent: parseResult.mainSrc.toString(),
    mainMap: parseResult.mainSrc.generateMap(),
  };
}
