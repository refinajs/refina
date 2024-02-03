import t from "@babel/types";

export type Decls = Record<
  string,
  {
    readonly: boolean;
  }
>;

export function getStmtDecls(ast: t.Statement): Decls {
  if (!t.isDeclaration(ast)) return {};

  const decls: Decls = {};

  switch (ast.type) {
    case "FunctionDeclaration":
    case "ClassDeclaration":
      if (ast.id) {
        decls[ast.id.name] = { readonly: false };
      }
      break;
    case "VariableDeclaration":
      for (const declaration of ast.declarations) {
        addLValToDecls(declaration.id, decls, ast.kind === "const");
      }
      break;
    case "ImportDeclaration":
      for (const specifier of ast.specifiers) {
        switch (specifier.type) {
          case "ImportSpecifier":
            decls[specifier.local.name] = { readonly: true };
            break;
          case "ImportDefaultSpecifier":
            decls[specifier.local.name] = { readonly: true };
            break;
          case "ImportNamespaceSpecifier":
            decls[specifier.local.name] = { readonly: true };
            break;
          default:
            const _exhaustiveCheck: never = specifier;
        }
      }
      break;
    case "ExportNamedDeclaration":
      if (ast.declaration) {
        Object.assign(decls, getStmtDecls(ast.declaration));
      }
      break;
    case "TSEnumDeclaration":
      decls[ast.id.name] = { readonly: true };
      break;
  }
  return decls;
}

function addLValToDecls(ast: t.LVal, decls: Decls, readonly: boolean) {
  switch (ast.type) {
    case "Identifier":
      decls[ast.name] = { readonly };
      break;
    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element !== null) {
          addLValToDecls(element, decls, readonly);
        }
      }
      break;
    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            addLValToDecls(property.argument, decls, readonly);
            break;
          case "ObjectProperty":
            if (property.key.type !== "Identifier")
              throw new Error("Object property must be an identifier");
            decls[property.key.name] = { readonly };
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;
    case "AssignmentPattern":
      addLValToDecls(ast.left, decls, readonly);
      break;
    case "RestElement":
      if (ast.argument.type !== "Identifier")
        throw new Error("Rest element must be an identifier");
      decls[ast.argument.name] = { readonly };
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
