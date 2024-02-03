import type { SourceMap } from "magic-string";
import { mainUrlSuffix } from "./constants";
import { cutSrc } from "./cutSrc";
import { Decls, getStmtDecls } from "./getDecls";
import { Deps, getExprDeps, getStmtDeps } from "./getDeps";
import { parse, ParseResult } from "./parser";
import { wrapLocals } from "./wrapLocals";
import { wrapMain } from "./wrapMain";
import type t from "@babel/types";

interface TransformResult {
  code: string;
  map: SourceMap;
}

export interface RefinaDescriptor {
  locals: TransformResult;
  main: TransformResult;
}

export function compile(id: string, src: string): RefinaDescriptor | null {
  if (!src.includes("$app")) return null;

  const parsed = parse(src);
  if (parsed === null) return null;

  const { callbackStmts, nonCallbackStmts } = extractCallbacks(parsed);

  const nonLocalsStmts = [...callbackStmts, ...parsed.viewStmts];
  const localsSrc = cutSrc(src, nonLocalsStmts);

  const nonMainStmts = [...nonCallbackStmts, ...parsed.otherStmts];
  const mainSrc = cutSrc(src, nonMainStmts);

  const bindings: Decls = {};
  for (const stmt of parsed.otherStmts) {
    Object.assign(bindings, getStmtDecls(stmt));
  }
  for (const stmt of nonCallbackStmts) {
    bindings[stmt.id!.name] = { readonly: true };
  }
  const usedBindings: Decls = {};

  const transformDeps = (deps: Deps) => {
    for (const name of Object.keys(deps)) {
      if (name in bindings) {
        deps[name].transformers.map(f => f(mainSrc));
        usedBindings[name] = bindings[name];
      }
    }
  };
  [...callbackStmts, ...parsed.viewStmts].forEach(stmt =>
    transformDeps(getStmtDeps(stmt)),
  );
  transformDeps(getExprDeps(parsed.mainFuncExpr));

  wrapLocals(parsed, localsSrc, id, usedBindings);

  wrapMain(parsed, mainSrc);

  return {
    locals: {
      code: localsSrc.toString(),
      map: localsSrc.generateMap({
        includeContent: true,
        source: id,
        file: id + ".map",
      }),
    },
    main: {
      code: mainSrc.toString(),
      map: mainSrc.generateMap({
        includeContent: true,
        source: id,
        file: id + mainUrlSuffix + ".map",
      }),
    },
  };
}

function extractCallbacks(parsed: ParseResult) {
  const funcNameToStmt = new Map<string, t.FunctionDeclaration>();
  for (const m of parsed.methodStmts) {
    funcNameToStmt.set(m.id!.name, m);
  }

  const callbackStmts: Set<t.FunctionDeclaration> = new Set(parsed.methodStmts);
  const nonCallbackStmts: Set<t.FunctionDeclaration> = new Set();

  let unchecked = parsed.otherStmts;
  while (unchecked.length > 0) {
    const newUnchecked: t.Statement[] = [];
    unchecked.map(getStmtDeps).forEach(dep => {
      for (const name of Object.keys(dep)) {
        const stmt = funcNameToStmt.get(name);
        if (stmt && callbackStmts.has(stmt)) {
          newUnchecked.push(stmt);
          callbackStmts.delete(stmt);
          nonCallbackStmts.add(stmt);
        }
      }
    });
    unchecked = newUnchecked;
  }

  return {
    callbackStmts: [...callbackStmts],
    nonCallbackStmts: [...nonCallbackStmts],
  };
}
