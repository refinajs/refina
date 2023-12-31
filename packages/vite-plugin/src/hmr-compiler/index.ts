import { SourceMap } from "magic-string";
import { mainUrlSuffix } from "./constants";
import { Binding, getBindings } from "./getBindings";
import { parse } from "./parse";
import { processExpr } from "./process";
import { wrapLocals } from "./wrapLocals";
import { wrapMain } from "./wrapMain";

export interface RefinaDescriptor {
  mainStart: number;
  mainEnd: number; // negative

  bindings: Binding[];

  localsRaw: string;
  localsContent: string;
  localsMap: SourceMap;

  mainRaw: string;
  mainContent: string;
  mainMap: SourceMap;
}

export function compile(
  src: string,
  srcPath: string,
): false | RefinaDescriptor {
  const parseResult = parse(src);
  if (parseResult === false) return false;

  const localsRaw = parseResult.localsSrc.toString();
  const mainRaw = parseResult.mainSrc.toString();

  const bindings = getBindings(parseResult.localsAst);

  wrapLocals(srcPath, parseResult, bindings, parseResult.appInstance);
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
    localsRaw,
    localsContent: parseResult.localsSrc.toString(),
    localsMap: parseResult.localsSrc.generateMap({
      includeContent: true,
      source: srcPath,
      file: srcPath + ".map",
    }),
    mainRaw,
    mainContent: parseResult.mainSrc.toString(),
    mainMap: parseResult.mainSrc.generateMap({
      includeContent: true,
      source: srcPath,
      file: srcPath + mainUrlSuffix + ".map",
    }),
  };
}

export function update(
  descriptor: RefinaDescriptor,
  newSrc: string,
  srcPath: string,
) {
  const newLocalsRaw =
    newSrc.slice(0, descriptor.mainStart) + newSrc.slice(descriptor.mainEnd);
  if (newLocalsRaw !== descriptor.localsRaw) {
    Object.assign(descriptor, compile(newSrc, srcPath));
    return "full-reload";
  }

  const newMainRaw = newSrc.slice(descriptor.mainStart, descriptor.mainEnd);
  if (newMainRaw !== descriptor.mainRaw) {
    const parseResult = parse(newSrc);
    if (parseResult === false) return "full-reload";
    const { mainAst, mainSrc } = parseResult;

    processExpr(
      mainAst,
      mainSrc,
      new Set(descriptor.bindings.map(b => b.name)),
    );
    wrapMain(mainSrc);

    descriptor.mainRaw = newMainRaw;
    descriptor.mainContent = mainSrc.toString();
    descriptor.mainMap = mainSrc.generateMap({
      includeContent: true,
      source: srcPath,
      file: srcPath + mainUrlSuffix + ".map",
    });
    return "update-main";
  }

  return "no-update";
}
