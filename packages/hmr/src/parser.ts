import { parse as babelParse } from "@babel/parser";
import t from "@babel/types";
import MagicString from "magic-string";

export interface ParseResult {
  localsAst: t.Statement[];
  localsSrc: MagicString;

  mainAst: t.Statement[];
  mainSrc: MagicString;

  appCallAst: t.ExpressionStatement | t.VariableDeclaration;
  appInstName: string | null;
  mainFuncAst: t.Expression;
}

export function parse(src: string): ParseResult | null {
  const statements = babelParse(src, {
    sourceType: "module",
    plugins: ["typescript"],
  }).program.body;

  const localsAst: t.Statement[] = [];
  const mainAst: t.Statement[] = [];
  let appCallAst: t.ExpressionStatement | t.VariableDeclaration | null = null;

  for (const statement of statements) {
    switch (statement.type) {
      case "ImportDeclaration":
        localsAst.push(statement);
        mainAst.push(statement);
        break;
      case "VariableDeclaration":
        if (
          statement.declarations.length === 1 &&
          statement.kind === "const" &&
          statement.declarations[0].init?.type === "CallExpression" &&
          statement.declarations[0].init.callee.type === "Identifier"
        ) {
          const calleeName = statement.declarations[0].init.callee.name;
          if (calleeName === "$app") {
            localsAst.push(statement);
            mainAst.push(statement);
            appCallAst = statement;
          } else if (calleeName === "$view") {
            mainAst.push(statement);
          } else {
            localsAst.push(statement);
          }
        } else {
          localsAst.push(statement);
        }
        break;
      case "ExpressionStatement":
        if (
          statement.expression.type === "CallExpression" &&
          statement.expression.callee.type === "Identifier" &&
          statement.expression.callee.name === "$app"
        ) {
          localsAst.push(statement);
          mainAst.push(statement);
          appCallAst = statement;
        } else {
          localsAst.push(statement);
        }
        break;
      default:
        localsAst.push(statement);
    }
  }

  if (!appCallAst) return null;

  const localsSrc = cutSrc(src, localsAst);
  const mainSrc = cutSrc(src, mainAst);

  let appInstName: string | null = null;
  let mainFuncAst: t.Expression;

  if (appCallAst.type === "VariableDeclaration") {
    const id = appCallAst.declarations[0].id;
    if (id.type !== "Identifier")
      throw new Error("App instance must be an identifier.");
    appInstName = id.name;

    mainFuncAst = (appCallAst.declarations[0].init! as t.CallExpression)
      .arguments[1] as t.Expression;
  } else {
    mainFuncAst = (appCallAst.expression as t.CallExpression)
      .arguments[1] as t.Expression;
  }

  return {
    localsAst,
    localsSrc,
    mainAst,
    mainSrc,
    appCallAst,
    appInstName,
    mainFuncAst,
  };
}

function cutSrc(src: string, statements: t.Statement[]) {
  const s = new MagicString(src);
  let cutStart = 0;
  for (const statement of statements) {
    if (cutStart < statement.start!) {
      s.update(cutStart, statement.start!, "\n");
    } else if (cutStart > statement.start!) {
      throw new Error("Statements are not in order.");
    }
    cutStart = statement.end!;
  }
  s.remove(cutStart, src.length);
  return s;
}
