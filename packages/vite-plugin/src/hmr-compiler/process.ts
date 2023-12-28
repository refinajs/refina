import t from "@babel/types";
import MagicString from "magic-string";
import { getLocalsAccessor } from "./constants";

function processStmt(
  ast: t.Statement,
  src: MagicString,
  bindings: Set<string>,
) {
  switch (ast.type) {
    case "BlockStatement":
      const innerBindings = new Set(bindings);
      for (const stmt of ast.body) {
        processStmt(stmt, src, innerBindings);
      }
      break;

    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "EmptyStatement":
      break;

    case "DoWhileStatement":
      processStmt(ast.body, src, bindings);
      break;

    case "ExpressionStatement":
      processExpr(ast.expression, src, bindings);
      break;

    case "ForInStatement":
      const innerBindings2 = new Set(bindings);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, src, innerBindings2);
      } else {
        processLVal(ast.left, src, innerBindings2);
      }
      processExpr(ast.right, src, innerBindings2);
      processStmt(ast.body, src, innerBindings2);
      break;

    case "ForStatement":
      const innerBindings3 = new Set(bindings);
      if (ast.init) {
        if (ast.init.type === "VariableDeclaration") {
          processVariableDeclaration(ast.init, src, innerBindings3);
        } else {
          processExpr(ast.init, src, innerBindings3);
        }
      }
      if (ast.test) processExpr(ast.test, src, innerBindings3);
      if (ast.update) processExpr(ast.update, src, innerBindings3);
      processStmt(ast.body, src, innerBindings3);
      break;

    case "FunctionDeclaration":
      if (ast.id) {
        bindings.add(ast.id.name);
      }
      const innerBindings4 = new Set(bindings);
      for (const param of ast.params) {
        processLVal(param, src, innerBindings4);
      }
      processStmt(ast.body, src, innerBindings4);
      break;

    case "IfStatement":
      const innerBindings5 = new Set(bindings);
      processExpr(ast.test, src, innerBindings5);
      processStmt(ast.consequent, src, innerBindings5);
      if (ast.alternate) processStmt(ast.alternate, src, innerBindings5);
      break;

    case "LabeledStatement":
      processStmt(ast.body, src, bindings);
      break;

    case "ReturnStatement":
      if (ast.argument) processExpr(ast.argument, src, bindings);
      break;

    case "SwitchStatement":
      processExpr(ast.discriminant, src, bindings);
      for (const caseClause of ast.cases) {
        if (caseClause.test) processExpr(caseClause.test, src, bindings);
        const innerBindings6 = new Set(bindings);
        for (const stmt of caseClause.consequent) {
          processStmt(stmt, src, innerBindings6);
        }
      }
      break;

    case "ThrowStatement":
      processExpr(ast.argument, src, bindings);
      break;

    case "TryStatement":
      processStmt(ast.block, src, bindings);
      if (ast.handler) {
        const innerBindings7 = new Set(bindings);
        if (ast.handler.param)
          processLVal(ast.handler.param, src, innerBindings7);
        processStmt(ast.handler.body, src, bindings);
      }
      if (ast.finalizer) processStmt(ast.finalizer, src, bindings);
      break;

    case "VariableDeclaration":
      processVariableDeclaration(ast, src, bindings);
      break;

    case "WhileStatement":
      const innerBindings8 = new Set(bindings);
      processExpr(ast.test, src, innerBindings8);
      processStmt(ast.body, src, innerBindings8);
      break;

    case "WithStatement":
      const innerBindings9 = new Set(bindings);
      processExpr(ast.object, src, innerBindings9);
      processStmt(ast.body, src, innerBindings9);
      break;

    case "ClassDeclaration":
      throw new Error("Not implemented: ClassDeclaration");

    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      throw new Error("Cannot export from app main");

    case "ForOfStatement":
      processExpr(ast.right, src, bindings);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, src, bindings);
      } else {
        processLVal(ast.left, src, bindings);
      }
      break;

    case "ImportDeclaration":
    case "TSImportEqualsDeclaration":
      throw new Error("Cannot import from app main");

    case "EnumDeclaration":
      throw new Error("Not implemented: EnumDeclaration");

    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSModuleDeclaration":
      break;

    case "TSEnumDeclaration":
      for (const member of ast.members) {
        if (member.initializer) {
          processExpr(member.initializer, src, bindings);
        }
      }
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

export function processExpr(
  ast: t.Expression,
  src: MagicString,
  bindings: ReadonlySet<string>,
) {
  switch (ast.type) {
    case "ArrayExpression":
      for (const element of ast.elements) {
        if (!element) continue;
        if (element.type === "SpreadElement") {
          processExpr(element.argument, src, bindings);
        } else {
          processExpr(element, src, bindings);
        }
      }
      break;

    case "AssignmentExpression":
      if (ast.left.type === "OptionalMemberExpression") {
        processExpr(ast.left, src, bindings);
      } else {
        processLVal(ast.left, src, bindings);
      }
      processExpr(ast.right, src, bindings);
      break;

    case "BinaryExpression":
      if (ast.left.type !== "PrivateName") {
        processExpr(ast.left, src, bindings);
      }
      processExpr(ast.right, src, bindings);
      break;

    case "CallExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      processExpr(ast.callee, src, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, src, bindings);
      }
      break;

    case "ConditionalExpression":
      processExpr(ast.test, src, bindings);
      processExpr(ast.consequent, src, bindings);
      processExpr(ast.alternate, src, bindings);
      break;

    case "FunctionExpression":
      const innerBindings = new Set(bindings);
      processStmt(ast.body, src, innerBindings);
      break;

    case "Identifier":
      if (bindings.has(ast.name)) {
        src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name));
      }
      break;

    case "LogicalExpression":
      processExpr(ast.left, src, bindings);
      processExpr(ast.right, src, bindings);
      break;

    case "MemberExpression":
      processExpr(ast.object, src, bindings);
      if (ast.property.type !== "PrivateName") {
        processExpr(ast.property, src, bindings);
      }
      break;

    case "NewExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      processExpr(ast.callee, src, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, src, bindings);
      }
      break;

    case "ObjectExpression":
      for (const property of ast.properties) {
        switch (property.type) {
          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error("Object property must be an identifier");
              const name = property.key.name;
              if (bindings.has(name)) {
                src.update(
                  property.key.start!,
                  property.key.end!,
                  `${name}:${getLocalsAccessor(name)}`,
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                processExpr(property.key, src, bindings);
              }
              processExprOrPatternLike(property.value, src, bindings);
            }
            break;
          case "SpreadElement":
            processExpr(property.argument, src, bindings);
            break;
          case "ObjectMethod":
            const innerBindings2 = new Set(bindings);
            for (const param of property.params) {
              processLVal(param, src, innerBindings2);
            }
            processStmt(property.body, src, innerBindings2);
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;

    case "SequenceExpression":
      for (const expression of ast.expressions) {
        processExpr(expression, src, bindings);
      }
      break;

    case "ParenthesizedExpression":
      processExpr(ast.expression, src, bindings);
      break;

    case "ThisExpression":
      break;

    case "UnaryExpression":
      processExpr(ast.argument, src, bindings);
      break;

    case "UpdateExpression":
      processExpr(ast.argument, src, bindings);
      break;

    case "ArrowFunctionExpression":
      const innerBindings3 = new Set(bindings);
      for (const param of ast.params) {
        processLVal(param, src, innerBindings3);
      }
      if (ast.body.type === "BlockStatement") {
        processStmt(ast.body, src, innerBindings3);
      } else {
        processExpr(ast.body, src, innerBindings3);
      }
      break;

    case "ClassExpression":
      break;

    case "ImportExpression":
      throw new Error("Not implemented: " + ast.type);

    case "MetaProperty":
      break;

    case "Super":
      break;

    case "TaggedTemplateExpression":
      processExpr(ast.tag, src, bindings);
      processExpr(ast.quasi, src, bindings);
      break;

    case "TemplateLiteral":
      for (const expression of ast.expressions) {
        if (t.isExpression(expression)) {
          processExpr(expression, src, bindings);
        }
      }
      break;

    case "YieldExpression":
      if (ast.argument) {
        processExpr(ast.argument, src, bindings);
      }
      break;

    case "AwaitExpression":
      processExpr(ast.argument, src, bindings);
      break;

    case "Import":
      break;

    case "OptionalMemberExpression":
      processExpr(ast.object, src, bindings);
      processExpr(ast.property, src, bindings);
      break;

    case "OptionalCallExpression":
      processExpr(ast.callee, src, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, src, bindings);
      }
      break;

    case "TypeCastExpression":
      processExpr(ast.expression, src, bindings);
      break;

    case "BindExpression":
    case "DoExpression":
    case "RecordExpression":
    case "TupleExpression":
      throw new Error("Not implemented: " + ast.type);

    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "BigIntLiteral":
    case "DecimalLiteral":
      // Literal
      break;

    case "JSXElement":
    case "JSXFragment":
    case "ModuleExpression":
    case "TopicReference":
    case "PipelineTopicExpression":
    case "PipelineBareFunction":
    case "PipelinePrimaryTopicReference":
      throw new Error("Not implemented: " + ast.type);

    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      processExpr(ast.expression, src, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processLVal(
  ast: t.LVal,
  src: MagicString,
  bindings: ReadonlySet<string>,
) {
  switch (ast.type) {
    case "Identifier":
      if (bindings.has(ast.name))
        src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name));
      break;

    case "MemberExpression":
      processExpr(ast.object, src, bindings);
      if (ast.property.type !== "PrivateName") {
        processExpr(ast.property, src, bindings);
      }
      break;

    case "RestElement":
      processLVal(ast.argument, src, bindings);
      break;

    case "AssignmentPattern":
      processLVal(ast.left, src, bindings);
      processExpr(ast.right, src, bindings);
      break;

    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element) processLVal(element, src, bindings);
      }
      break;

    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            processLVal(property, src, bindings);
            break;
          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error("Object property must be an identifier");
              const name = property.key.name;
              if (bindings.has(name)) {
                src.update(
                  property.key.start!,
                  property.key.end!,
                  `${name}:${getLocalsAccessor(name)}`,
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                processExpr(property.key, src, bindings);
              }
              // may be assignment pattern
              processExprOrPatternLike(property.value, src, bindings);
            }
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;

    case "TSParameterProperty":
      break;

    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      processExpr(ast.expression, src, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processDeclarationId(
  ast: t.LVal,
  src: MagicString,
  bindings: Set<string>,
) {
  switch (ast.type) {
    case "Identifier":
      bindings.delete(ast.name);
      break;

    case "MemberExpression":
      throw new Error(`Unsupported declaration type: ${ast.type}`);

    case "RestElement":
      if (ast.argument.type !== "Identifier")
        throw new Error("Rest element must be an identifier in variable decl");
      bindings.delete(ast.argument.name);
      break;

    case "AssignmentPattern":
      processDeclarationId(ast.left, src, bindings);
      // let { a = a } = {}; should throw ReferenceError.
      processExpr(ast.right, src, bindings);
      break;

    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element) processDeclarationId(element, src, bindings);
      }
      break;

    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            if (property.argument.type !== "Identifier")
              throw new Error(
                "Rest element must be an identifier in variable decl",
              );
            bindings.delete(property.argument.name);
            break;

          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error(
                  "Object property must be an identifier in variable decl",
                );
              bindings.delete(property.key.name);
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                processExpr(property.key, src, bindings);
              }
              if (!t.isLVal(property.value))
                throw new Error(
                  "Object property must be a pattern in variable decl",
                );
              processDeclarationId(property.value, src, bindings);
            }
            break;

          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;

    case "TSParameterProperty":
      break;

    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      processExpr(ast.expression, src, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processVariableDeclaration(
  ast: t.VariableDeclaration,
  src: MagicString,
  bindings: Set<string>,
) {
  const declarations = ast.declarations;
  for (const declaration of declarations) {
    if (declaration.init) processExpr(declaration.init, src, bindings);
    processDeclarationId(declaration.id, src, bindings);
  }
}

function processExprOrPatternLike(
  ast: t.Expression | t.PatternLike,
  src: MagicString,
  bindings: ReadonlySet<string>,
) {
  if (t.isPatternLike(ast)) {
    processLVal(ast, src, bindings);
  } else {
    processExpr(ast, src, bindings);
  }
}

function processArgument(
  ast:
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.ArgumentPlaceholder,
  src: MagicString,
  bindings: ReadonlySet<string>,
) {
  if (t.isJSXNamespacedName(ast)) {
  } else if (ast.type === "SpreadElement") {
    processExpr(ast.argument, src, bindings);
  } else if (ast.type === "ArgumentPlaceholder") {
    throw new Error("Not implemented: " + ast.type);
  } else {
    processExpr(ast, src, bindings);
  }
}
