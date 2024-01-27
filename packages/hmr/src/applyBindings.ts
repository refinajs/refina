import t from "@babel/types";
import MagicString from "magic-string";
import { getLocalsAccessor } from "./constants";
import { Bindings } from "./getBindings";
import { ParseResult } from "./parser";

class Context {
  constructor(public src: MagicString) {}
  usedBindings: Bindings = {};
  getting(id: string): void {
    this.usedBindings[id] ??= true;
  }
  setting(id: string): void {
    this.usedBindings[id] = false;
  }
}

export function applyBindings(
  { mainAst, mainSrc, appCallAst, mainFuncAst }: ParseResult,
  bindings: Record<string, boolean>,
) {
  const src = new Context(mainSrc);
  const bindingsSet = new Set(Object.keys(bindings));
  for (const stmt of mainAst) {
    if (stmt === appCallAst) {
      processExpr(mainFuncAst, src, bindingsSet);
    } else {
      processStmt(stmt, src, bindingsSet);
    }
  }
  return src.usedBindings;
}

function processStmt(ast: t.Statement, ctx: Context, bindings: Set<string>) {
  switch (ast.type) {
    case "BlockStatement":
      const innerBindings = new Set(bindings);
      for (const stmt of ast.body) {
        processStmt(stmt, ctx, innerBindings);
      }
      break;

    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "EmptyStatement":
      break;

    case "DoWhileStatement":
      processStmt(ast.body, ctx, bindings);
      break;

    case "ExpressionStatement":
      processExpr(ast.expression, ctx, bindings);
      break;

    case "ForInStatement":
      const innerBindings2 = new Set(bindings);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, ctx, innerBindings2);
      } else {
        processLVal(ast.left, ctx, innerBindings2);
      }
      processExpr(ast.right, ctx, innerBindings2);
      processStmt(ast.body, ctx, innerBindings2);
      break;

    case "ForStatement":
      const innerBindings3 = new Set(bindings);
      if (ast.init) {
        if (ast.init.type === "VariableDeclaration") {
          processVariableDeclaration(ast.init, ctx, innerBindings3);
        } else {
          processExpr(ast.init, ctx, innerBindings3);
        }
      }
      if (ast.test) processExpr(ast.test, ctx, innerBindings3);
      if (ast.update) processExpr(ast.update, ctx, innerBindings3);
      processStmt(ast.body, ctx, innerBindings3);
      break;

    case "FunctionDeclaration":
      if (ast.id) {
        bindings.add(ast.id.name);
      }
      const innerBindings4 = new Set(bindings);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerBindings4);
      }
      processStmt(ast.body, ctx, innerBindings4);
      break;

    case "IfStatement":
      const innerBindings5 = new Set(bindings);
      processExpr(ast.test, ctx, innerBindings5);
      processStmt(ast.consequent, ctx, innerBindings5);
      if (ast.alternate) processStmt(ast.alternate, ctx, innerBindings5);
      break;

    case "LabeledStatement":
      processStmt(ast.body, ctx, bindings);
      break;

    case "ReturnStatement":
      if (ast.argument) processExpr(ast.argument, ctx, bindings);
      break;

    case "SwitchStatement":
      processExpr(ast.discriminant, ctx, bindings);
      for (const caseClause of ast.cases) {
        if (caseClause.test) processExpr(caseClause.test, ctx, bindings);
        const innerBindings6 = new Set(bindings);
        for (const stmt of caseClause.consequent) {
          processStmt(stmt, ctx, innerBindings6);
        }
      }
      break;

    case "ThrowStatement":
      processExpr(ast.argument, ctx, bindings);
      break;

    case "TryStatement":
      processStmt(ast.block, ctx, bindings);
      if (ast.handler) {
        const innerBindings7 = new Set(bindings);
        if (ast.handler.param)
          processLVal(ast.handler.param, ctx, innerBindings7);
        processStmt(ast.handler.body, ctx, bindings);
      }
      if (ast.finalizer) processStmt(ast.finalizer, ctx, bindings);
      break;

    case "VariableDeclaration":
      processVariableDeclaration(ast, ctx, bindings);
      break;

    case "WhileStatement":
      const innerBindings8 = new Set(bindings);
      processExpr(ast.test, ctx, innerBindings8);
      processStmt(ast.body, ctx, innerBindings8);
      break;

    case "WithStatement":
      const innerBindings9 = new Set(bindings);
      processExpr(ast.object, ctx, innerBindings9);
      processStmt(ast.body, ctx, innerBindings9);
      break;

    case "ClassDeclaration":
      throw new Error("Not implemented: ClassDeclaration");

    case "ExportAllDeclaration":
      break;

    case "ExportDefaultDeclaration":
      if (t.isExpression(ast.declaration)) {
        processExpr(ast.declaration, ctx, bindings);
      } else {
        processStmt(ast.declaration, ctx, bindings);
      }
      break;

    case "ExportNamedDeclaration":
      if (ast.declaration) {
        processStmt(ast.declaration, ctx, bindings);
      } else if (ast.source) {
        // export { a, b } from "module";
      } else {
        for (const specifier of ast.specifiers) {
          if (specifier.type === "ExportSpecifier") {
            processExpr(specifier.local, ctx, bindings);
          } else {
            throw new Error("Not implemented: ExportNamespaceSpecifier");
          }
        }
      }
      break;

    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      throw new Error(`Not implemented: ${ast.type}`);

    case "ForOfStatement":
      processExpr(ast.right, ctx, bindings);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, ctx, bindings);
      } else {
        processLVal(ast.left, ctx, bindings);
      }
      break;

    case "ImportDeclaration":
      break;

    case "TSImportEqualsDeclaration":
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
          processExpr(member.initializer, ctx, bindings);
        }
      }
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processExpr(
  ast: t.Expression,
  ctx: Context,
  bindings: ReadonlySet<string>,
) {
  switch (ast.type) {
    case "ArrayExpression":
      for (const element of ast.elements) {
        if (!element) continue;
        if (element.type === "SpreadElement") {
          processExpr(element.argument, ctx, bindings);
        } else {
          processExpr(element, ctx, bindings);
        }
      }
      break;

    case "AssignmentExpression":
      if (ast.left.type === "OptionalMemberExpression") {
        processExpr(ast.left, ctx, bindings);
      } else {
        processLVal(ast.left, ctx, bindings);
      }
      processExpr(ast.right, ctx, bindings);
      break;

    case "BinaryExpression":
      if (ast.left.type !== "PrivateName") {
        processExpr(ast.left, ctx, bindings);
      }
      processExpr(ast.right, ctx, bindings);
      break;

    case "CallExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      processExpr(ast.callee, ctx, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, bindings);
      }
      break;

    case "ConditionalExpression":
      processExpr(ast.test, ctx, bindings);
      processExpr(ast.consequent, ctx, bindings);
      processExpr(ast.alternate, ctx, bindings);
      break;

    case "FunctionExpression":
      const innerBindings = new Set(bindings);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerBindings);
      }
      processStmt(ast.body, ctx, innerBindings);
      break;

    case "Identifier":
      if (bindings.has(ast.name)) {
        ctx.getting(ast.name);
        ctx.src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name));
      }
      break;

    case "LogicalExpression":
      processExpr(ast.left, ctx, bindings);
      processExpr(ast.right, ctx, bindings);
      break;

    case "MemberExpression":
      processExpr(ast.object, ctx, bindings);
      if (ast.property.type !== "PrivateName") {
        processExpr(ast.property, ctx, bindings);
      }
      break;

    case "NewExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      processExpr(ast.callee, ctx, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, bindings);
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
                ctx.getting(name);
                ctx.src.update(
                  property.key.start!,
                  property.key.end!,
                  `${name}:${getLocalsAccessor(name)}`,
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                processExpr(property.key, ctx, bindings);
              }
              const value = property.value;
              if (t.isExpression(value)) {
                processExpr(value, ctx, bindings);
              } else {
                processLVal(value, ctx, bindings);
              }
            }
            break;
          case "SpreadElement":
            processExpr(property.argument, ctx, bindings);
            break;
          case "ObjectMethod":
            const innerBindings2 = new Set(bindings);
            for (const param of property.params) {
              processLVal(param, ctx, innerBindings2);
            }
            processStmt(property.body, ctx, innerBindings2);
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;

    case "SequenceExpression":
      for (const expression of ast.expressions) {
        processExpr(expression, ctx, bindings);
      }
      break;

    case "ParenthesizedExpression":
      processExpr(ast.expression, ctx, bindings);
      break;

    case "ThisExpression":
      break;

    case "UnaryExpression":
      processExpr(ast.argument, ctx, bindings);
      break;

    case "UpdateExpression":
      processExpr(ast.argument, ctx, bindings);
      break;

    case "ArrowFunctionExpression":
      const innerBindings3 = new Set(bindings);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerBindings3);
      }
      if (ast.body.type === "BlockStatement") {
        processStmt(ast.body, ctx, innerBindings3);
      } else {
        processExpr(ast.body, ctx, innerBindings3);
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
      processExpr(ast.tag, ctx, bindings);
      processExpr(ast.quasi, ctx, bindings);
      break;

    case "TemplateLiteral":
      for (const expression of ast.expressions) {
        if (t.isExpression(expression)) {
          processExpr(expression, ctx, bindings);
        }
      }
      break;

    case "YieldExpression":
      if (ast.argument) {
        processExpr(ast.argument, ctx, bindings);
      }
      break;

    case "AwaitExpression":
      processExpr(ast.argument, ctx, bindings);
      break;

    case "OptionalMemberExpression":
      processExpr(ast.object, ctx, bindings);
      processExpr(ast.property, ctx, bindings);
      break;

    case "OptionalCallExpression":
      processExpr(ast.callee, ctx, bindings);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, bindings);
      }
      break;

    case "TypeCastExpression":
      processExpr(ast.expression, ctx, bindings);
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

    case "Import":
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
      processExpr(ast.expression, ctx, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processLVal(ast: t.LVal, ctx: Context, bindings: ReadonlySet<string>) {
  switch (ast.type) {
    case "Identifier":
      if (bindings.has(ast.name)) ctx.setting(ast.name);
      ctx.src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name));
      break;

    case "MemberExpression":
      processExpr(ast.object, ctx, bindings);
      if (ast.property.type !== "PrivateName") {
        processExpr(ast.property, ctx, bindings);
      }
      break;

    case "RestElement":
      processLVal(ast.argument, ctx, bindings);
      break;

    case "AssignmentPattern":
      processLVal(ast.left, ctx, bindings);
      processExpr(ast.right, ctx, bindings);
      break;

    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element) processLVal(element, ctx, bindings);
      }
      break;

    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            processLVal(property, ctx, bindings);
            break;
          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error("Object property must be an identifier");
              const name = property.key.name;
              if (bindings.has(name)) {
                ctx.setting(name);
                ctx.src.update(
                  property.key.start!,
                  property.key.end!,
                  `${name}:${getLocalsAccessor(name)}`,
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                processExpr(property.key, ctx, bindings);
              }
              const value = property.value;
              if (t.isPatternLike(value)) {
                processLVal(value, ctx, bindings);
              } else {
                processExpr(value, ctx, bindings);
              }
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
      processExpr(ast.expression, ctx, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processDeclarationId(
  ast: t.LVal,
  ctx: Context,
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
      processDeclarationId(ast.left, ctx, bindings);
      // let { a = a } = {}; should throw ReferenceError.
      processExpr(ast.right, ctx, bindings);
      break;

    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element) processDeclarationId(element, ctx, bindings);
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
                processExpr(property.key, ctx, bindings);
              }
              if (!t.isLVal(property.value))
                throw new Error(
                  "Object property must be a pattern in variable decl",
                );
              processDeclarationId(property.value, ctx, bindings);
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
      processExpr(ast.expression, ctx, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processVariableDeclaration(
  ast: t.VariableDeclaration,
  ctx: Context,
  bindings: Set<string>,
) {
  const declarations = ast.declarations;
  for (const declaration of declarations) {
    if (declaration.init) processExpr(declaration.init, ctx, bindings);
    processDeclarationId(declaration.id, ctx, bindings);
  }
}

function processArgument(
  ast:
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.ArgumentPlaceholder,
  ctx: Context,
  bindings: ReadonlySet<string>,
) {
  if (t.isJSXNamespacedName(ast)) {
  } else if (ast.type === "SpreadElement") {
    processExpr(ast.argument, ctx, bindings);
  } else if (ast.type === "ArgumentPlaceholder") {
    throw new Error("Not implemented: " + ast.type);
  } else {
    processExpr(ast, ctx, bindings);
  }
}
