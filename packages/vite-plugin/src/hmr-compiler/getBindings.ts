import type t from "@babel/types";
import type MagicString from "magic-string";

export interface Binding {
  name: string;
  readonly: boolean;
}

export function getBindings(
  localsAst: t.Statement[],
  localsSrc: MagicString,
): Binding[] {
  const bindings: Binding[] = [];
  for (const statement of localsAst) {
    if (statement.type === "VariableDeclaration") {
      const readonly = statement.kind === "const";
      const declarations = statement.declarations;
      for (const declaration of declarations) {
        const id = declaration.id;
        switch (id.type) {
          case "Identifier":
            bindings.push({ name: id.name, readonly });
            break;
          case "MemberExpression":
            const name = localsSrc.slice(id.start!, id.end!);
            bindings.push({ name, readonly });
            break;
          case "ArrayPattern":
            break;
          case "ObjectPattern":
            for (const property of id.properties) {
              switch (property.type) {
                case "RestElement":
                  if (property.argument.type !== "Identifier")
                    throw new Error("Rest element must be an identifier");
                  bindings.push({
                    name: property.argument.name,
                    readonly,
                  });
                  break;
                case "ObjectProperty":
                  if (property.key.type !== "Identifier")
                    throw new Error("Object property must be an identifier");
                  bindings.push({
                    name: property.key.name,
                    readonly,
                  });
                  break;
                default:
                  const _exhaustiveCheck: never = property;
              }
            }
            break;
          case "RestElement":
          case "AssignmentPattern":
          case "TSParameterProperty":
          case "TSAsExpression":
          case "TSSatisfiesExpression":
          case "TSTypeAssertion":
          case "TSNonNullExpression":
            throw new Error("Unsupported binding type: " + id.type);
          default:
            const _exhaustiveCheck: never = id;
        }
      }
    } else if (statement.type === "FunctionDeclaration") {
      bindings.push({
        name: statement.id!.name,
        readonly: true,
      });
    } else if (statement.type === "ImportDeclaration") {
      if (statement.importKind === "type") continue;
      for (const specifier of statement.specifiers) {
        if (specifier.local.name !== "app") {
          bindings.push({
            name: specifier.local.name,
            readonly: true,
          });
        }
      }
    }
  }
  return bindings;
}
