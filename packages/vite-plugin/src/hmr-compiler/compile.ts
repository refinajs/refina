import { RefinaDescriptor, mainUrlSuffix } from "./constants";
import { getBindings } from "./getBindings";
import { parse } from "./parser";
import { processExpr } from "./process";
import { wrapLocals } from "./wrapLocals";
import { wrapMain } from "./wrapMain";

export function compile(id: string, src: string): RefinaDescriptor | null {
  if (!src.includes("$app")) return null;

  const parseResult = parse(src);
  if (parseResult === null) return null;

  const localsRaw = parseResult.localsSrc.toString();
  const mainRaw = parseResult.mainSrc.toString();

  const bindings = getBindings(parseResult.localsAst);
  const usedBindings = new Set<string>();

  processExpr(
    parseResult.mainAst,
    { s: parseResult.mainSrc, usedBindings },
    new Set(Object.keys(bindings)),
  );

  wrapLocals(
    id,
    parseResult,
    Object.fromEntries(
      Object.entries(bindings).filter(([name]) => usedBindings.has(name)),
    ),
    parseResult.appInstance,
  );
  wrapMain(parseResult.mainSrc);

  return {
    mainStart: parseResult.mainStart,
    mainEnd: parseResult.mainEnd,
    bindings,
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
