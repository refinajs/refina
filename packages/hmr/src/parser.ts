import { parse as babelParse } from "@babel/parser";
import t from "@babel/types";
import MagicString from "magic-string";

export interface ParseResult {
  appCallStart: number;
  appCallEnd: number;

  mainStart: number;
  mainEnd: number;

  imports: string;

  localsAst: t.Statement[];
  localsSrc: MagicString;

  mainAst: t.Expression;
  mainSrc: MagicString;

  appInstance: string | null;
}

function isCalleeApp(callee: t.Expression | t.V8IntrinsicIdentifier) {
  return callee.type === "Identifier" && callee.name === "$app";
}

export function parse(src: string): ParseResult | null {
  const statements = babelParse(src, {
    sourceType: "module",
    plugins: ["typescript"],
  }).program.body;

  let imports = "";
  for (const statement of statements) {
    if (statement.type === "ImportDeclaration") {
      imports += src.slice(statement.start!, statement.end!) + ";\n";
    }
  }

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "CallExpression" &&
      isCalleeApp(statement.expression.callee)
    ) {
      const mainAst = statement.expression.arguments[1] as t.Expression;
      const mainStart = mainAst.start!;
      const mainEnd = mainAst.end! - src.length;

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
        imports,
        localsAst: statements.filter((_, j) => j !== i),
        localsSrc,
        mainAst,
        mainSrc,
        appInstance: null,
      };
    }

    if (
      statement.type === "VariableDeclaration" &&
      statement.declarations.length === 1 &&
      statement.declarations[0].init?.type === "CallExpression" &&
      isCalleeApp(statement.declarations[0].init.callee)
    ) {
      const declaration = statement.declarations[0];

      if (statement.kind !== "const") {
        throw new Error("Cannot declare non-const app instance.");
      }

      const mainAst = statement.declarations[0].init
        .arguments[1] as t.Expression;
      const mainStart = mainAst.start!;
      const mainEnd = mainAst.end! - src.length;

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
        imports,
        localsAst: statements.filter((_, j) => j !== i),
        localsSrc,
        mainAst,
        mainSrc,
        appInstance: (declaration.id as t.Identifier).name,
      };
    }
  }
  return null;
}
