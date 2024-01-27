import t from "@babel/types";
import { ParseResult } from "./parser";

export type Bindings = Record<string, boolean>;

export function getBindings({ localsAst, appCallAst }: ParseResult): Bindings {
  const bindings: Bindings = {};
  for (const statement of localsAst) {
    if (statement !== appCallAst && t.isDeclaration(statement)) {
      addDeclarationToBindings(statement, bindings);
    }
  }
  return bindings;
}

function addDeclarationToBindings(ast: t.Declaration, bindings: Bindings) {
  switch (ast.type) {
    case "FunctionDeclaration":
    case "ClassDeclaration":
      if (ast.id) {
        bindings[ast.id.name] = false;
      }
      break;
    case "VariableDeclaration":
      for (const declaration of ast.declarations) {
        addLValToBindings(declaration.id, bindings, ast.kind === "const");
      }
      break;
    case "ExportNamedDeclaration":
      if (ast.declaration) {
        addDeclarationToBindings(ast.declaration, bindings);
      }
      break;
    case "TSEnumDeclaration":
      bindings[ast.id.name] = true;
      break;
  }
}

function addLValToBindings(ast: t.LVal, bindings: Bindings, readonly: boolean) {
  switch (ast.type) {
    case "Identifier":
      bindings[ast.name] = readonly;
      break;
    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element !== null) {
          addLValToBindings(element, bindings, readonly);
        }
      }
      break;
    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            addLValToBindings(property.argument, bindings, readonly);
            break;
          case "ObjectProperty":
            if (property.key.type !== "Identifier")
              throw new Error("Object property must be an identifier");
            bindings[property.key.name] = readonly;
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;
    case "AssignmentPattern":
      addLValToBindings(ast.left, bindings, readonly);
      break;
    case "RestElement":
      if (ast.argument.type !== "Identifier")
        throw new Error("Rest element must be an identifier");
      bindings[ast.argument.name] = readonly;
      break;
    case "MemberExpression":
    case "TSParameterProperty":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      throw new Error("Unsupported binding type: " + ast.type);
    default:
      const _exhaustiveCheck: never = ast;
  }
}
