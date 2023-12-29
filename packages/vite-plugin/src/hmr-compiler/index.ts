import { parseExpression } from "@babel/parser";
import MagicString, { SourceMap } from "magic-string";
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
  mainpath: string,
): false | RefinaDescriptor {
  const parseResult = parse(src);
  if (parseResult === false) return false;

  const localsRaw = parseResult.localsSrc.toString();
  const mainRaw = parseResult.mainSrc.toString();

  const bindings = getBindings(parseResult.localsAst, parseResult.localsSrc);
  wrapLocals(mainpath, parseResult, bindings);
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
    localsMap: parseResult.localsSrc.generateMap(),
    mainRaw,
    mainContent: parseResult.mainSrc.toString(),
    mainMap: parseResult.mainSrc.generateMap(),
  };
}

export function update(
  descriptor: RefinaDescriptor,
  newSrc: string,
  mainpath: string,
) {
  const newLocalsRaw =
    newSrc.slice(0, descriptor.mainStart) + newSrc.slice(descriptor.mainEnd);
  if (newLocalsRaw !== descriptor.localsRaw) {
    Object.assign(descriptor, compile(newSrc, mainpath));
    return "full-reload";
  }

  const newMainRaw = newSrc.slice(descriptor.mainStart, descriptor.mainEnd);
  if (newMainRaw !== descriptor.mainRaw) {
    const mainAst = parseExpression(newMainRaw);
    const mainSrc = new MagicString(newMainRaw);
    processExpr(
      mainAst,
      mainSrc,
      new Set(descriptor.bindings.map(b => b.name)),
    );
    wrapMain(mainSrc);

    descriptor.mainRaw = newMainRaw;
    descriptor.mainContent = mainSrc.toString();
    descriptor.mainMap = mainSrc.generateMap();
    return "update-main";
  }

  return "no-update";
}
