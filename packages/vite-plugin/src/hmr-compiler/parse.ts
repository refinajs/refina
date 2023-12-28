import { parse as babelParse } from "@babel/parser";
import t from "@babel/types";
import MagicString from "magic-string";

export interface ParseResult {
  appCallStart: number;
  appCallEnd: number;

  mainStart: number;
  mainEnd: number;

  localsAst: t.Statement[];
  localsSrc: MagicString;

  mainAst: t.Expression;
  mainSrc: MagicString;
}

function isCalleeApp(callee: t.Expression | t.V8IntrinsicIdentifier) {
  if (callee.type === "Identifier") return callee.name === "$app";
  if (callee.type === "CallExpression") return isCalleeApp(callee.callee);
  if (callee.type === "MemberExpression") return isCalleeApp(callee.object);
  return false;
}

export function parse(src: string): ParseResult | false {
  const statements = babelParse(src, {
    sourceType: "module",
    plugins: ["typescript"],
  }).program.body;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "CallExpression" &&
      isCalleeApp(statement.expression.callee)
    ) {
      const mainStart = statement.expression.arguments[0].start!;
      const mainEnd = statement.expression.arguments[0].end!;

      const localsSrc = new MagicString(src);
      localsSrc.remove(mainStart, mainEnd);

      const mainSrc = new MagicString(src);
      mainSrc.remove(0, mainStart);
      mainSrc.remove(mainEnd, src.length);

      return {
        appCallStart: statement.start!,
        appCallEnd: statement.end!,
        mainStart,
        mainEnd,
        localsAst: statements.filter((_, j) => j !== i),
        localsSrc,
        mainAst: statement.expression.arguments[0] as t.Expression,
        mainSrc,
      };
    }
  }
  return false;
}
