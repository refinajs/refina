import type { SourceMap } from "magic-string";
import { applyBindings } from "./applyBindings";
import { mainUrlSuffix } from "./constants";
import { getBindings } from "./getBindings";
import { parse } from "./parser";
import { wrapLocals } from "./wrapLocals";
import { wrapMain } from "./wrapMain";

interface TransformResult {
  raw: string;
  code: string;
  map: SourceMap;
}

export interface RefinaDescriptor {
  locals: TransformResult;
  main: TransformResult;
}

export function compile(id: string, src: string): RefinaDescriptor | null {
  if (!src.includes("$app")) return null;

  const parseResult = parse(src);
  if (parseResult === null) return null;

  const localsRaw = parseResult.localsSrc.toString();
  const mainRaw = parseResult.mainSrc.toString();

  const bindings = getBindings(parseResult);
  const usedBindings = applyBindings(parseResult, bindings);

  wrapLocals(parseResult, id, usedBindings, bindings);
  wrapMain(parseResult);

  return {
    locals: {
      raw: localsRaw,
      code: parseResult.localsSrc.toString(),
      map: parseResult.localsSrc.generateMap({
        includeContent: true,
        source: id,
        file: id + ".map",
      }),
    },
    main: {
      raw: mainRaw,
      code: parseResult.mainSrc.toString(),
      map: parseResult.mainSrc.generateMap({
        includeContent: true,
        source: id,
        file: id + mainUrlSuffix + ".map",
      }),
    },
  };
}
