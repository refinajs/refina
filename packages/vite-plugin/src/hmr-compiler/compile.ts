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

  wrapLocals(id, parseResult, bindings, parseResult.appInstance);
  processExpr(
    parseResult.mainAst,
    parseResult.mainSrc,
    new Set(bindings.map(b => b.name)),
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
