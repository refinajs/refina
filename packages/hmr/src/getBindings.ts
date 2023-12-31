import type t from "@babel/types";

export type Bindings = Record<string, boolean>;

export function getBindings(ast: t.Statement[]): Bindings {
  const bindings: Bindings = {};
  for (const statement of ast) {
    if (statement.type === "VariableDeclaration") {
      const readonly = statement.kind === "const";
      for (const declaration of statement.declarations) {
        addLValToBindings(declaration.id, bindings, readonly);
      }
    } else if (
      statement.type === "FunctionDeclaration" ||
      statement.type === "ClassDeclaration"
    ) {
      bindings[statement.id!.name] = true;
    }
  }
  return bindings;
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
