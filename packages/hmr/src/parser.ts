import { parse as babelParse } from "@babel/parser";
import t from "@babel/types";

export interface ParseResult {
  statements: t.Statement[];

  importStmts: t.Statement[];
  methodStmts: t.FunctionDeclaration[];
  viewStmts: t.Statement[];
  otherStmts: t.Statement[];

  appStmt: t.ExpressionStatement | t.VariableDeclaration;
  appInstName: string | null;
  mainFuncExpr: t.Expression;
}

export function parse(src: string): ParseResult | null {
  const statements = babelParse(src, {
    sourceType: "module",
    plugins: ["typescript"],
  }).program.body;

  const importStmts: t.Statement[] = [];
  const methodStmts: t.FunctionDeclaration[] = [];
  const viewStmts: t.Statement[] = [];
  let appStmt: t.ExpressionStatement | t.VariableDeclaration | null = null;
  const otherStmts: t.Statement[] = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    switch (statement.type) {
      case "ImportDeclaration":
        importStmts.push(statement);
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
            appStmt = statement;
          } else if (calleeName === "$view") {
            viewStmts.push(statement);
          } else {
            otherStmts.push(statement);
          }
        } else {
          otherStmts.push(statement);
        }
        break;
      case "ExpressionStatement":
        if (
          statement.expression.type === "CallExpression" &&
          statement.expression.callee.type === "Identifier" &&
          statement.expression.callee.name === "$app"
        ) {
          appStmt = statement;
        } else {
          otherStmts.push(statement);
        }
        break;
      case "FunctionDeclaration":
        methodStmts.push(statement);
        break;
      default:
        otherStmts.push(statement);
    }
  }

  if (!appStmt) return null;

  let appInstName: string | null = null;
  let mainFuncExpr: t.Expression;

  if (appStmt.type === "VariableDeclaration") {
    const id = appStmt.declarations[0].id;
    if (id.type !== "Identifier")
      throw new Error("App instance must be an identifier.");
    appInstName = id.name;

    mainFuncExpr = (appStmt.declarations[0].init! as t.CallExpression)
      .arguments[1] as t.Expression;
  } else {
    mainFuncExpr = (appStmt.expression as t.CallExpression)
      .arguments[1] as t.Expression;
  }

  return {
    statements,
    importStmts,
    methodStmts,
    viewStmts,
    appStmt,
    otherStmts,
    appInstName,
    mainFuncExpr,
  };
}
