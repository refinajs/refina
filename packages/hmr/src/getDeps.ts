import t from "@babel/types";
import MagicString from "magic-string";
import { getLocalsAccessor } from "./constants";

type Transformer = (src: MagicString) => void;

export type Deps = Record<
  string,
  {
    write: boolean;
    transformers: Transformer[];
  }
>;

class GetDepsContext {
  deps: Deps = {};
  getting(id: string, transformer: Transformer): void {
    this.deps[id] ??= {
      write: false,
      transformers: [],
    };
    this.deps[id].transformers.push(transformer);
  }
  setting(id: string, transformer: Transformer): void {
    this.deps[id] ??= {
      write: true,
      transformers: [],
    };
    this.deps[id].write = true;
    this.deps[id].transformers.push(transformer);
  }
}

export function getStmtDeps(ast: t.Statement): Deps {
  const context = new GetDepsContext();
  getStmtDepsImpl(ast, context, new Set());
  return context.deps;
}

export function getExprDeps(ast: t.Expression): Deps {
  const context = new GetDepsContext();
  getExprDepsImpl(ast, context, new Set());
  return context.deps;
}

function getStmtDepsImpl(
  ast: t.Statement,
  ctx: GetDepsContext,
  locals: Set<string>,
) {
  switch (ast.type) {
    case "BlockStatement":
      const innerLocals = new Set(locals);
      for (const stmt of ast.body) {
        getStmtDepsImpl(stmt, ctx, innerLocals);
      }
      break;

    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "EmptyStatement":
      break;

    case "DoWhileStatement":
      getStmtDepsImpl(ast.body, ctx, locals);
      break;

    case "ExpressionStatement":
      getExprDepsImpl(ast.expression, ctx, locals);
      break;

    case "ForInStatement":
      const innerLocals2 = new Set(locals);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, ctx, innerLocals2);
      } else {
        processLVal(ast.left, ctx, innerLocals2);
      }
      getExprDepsImpl(ast.right, ctx, innerLocals2);
      getStmtDepsImpl(ast.body, ctx, innerLocals2);
      break;

    case "ForStatement":
      const innerLocals3 = new Set(locals);
      if (ast.init) {
        if (ast.init.type === "VariableDeclaration") {
          processVariableDeclaration(ast.init, ctx, innerLocals3);
        } else {
          getExprDepsImpl(ast.init, ctx, innerLocals3);
        }
      }
      if (ast.test) getExprDepsImpl(ast.test, ctx, innerLocals3);
      if (ast.update) getExprDepsImpl(ast.update, ctx, innerLocals3);
      getStmtDepsImpl(ast.body, ctx, innerLocals3);
      break;

    case "FunctionDeclaration":
      if (ast.id) {
        locals.add(ast.id.name);
      }
      const innerLocals4 = new Set(locals);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerLocals4);
      }
      getStmtDepsImpl(ast.body, ctx, innerLocals4);
      break;

    case "IfStatement":
      const innerLocals5 = new Set(locals);
      getExprDepsImpl(ast.test, ctx, innerLocals5);
      getStmtDepsImpl(ast.consequent, ctx, innerLocals5);
      if (ast.alternate) getStmtDepsImpl(ast.alternate, ctx, innerLocals5);
      break;

    case "LabeledStatement":
      getStmtDepsImpl(ast.body, ctx, locals);
      break;

    case "ReturnStatement":
      if (ast.argument) getExprDepsImpl(ast.argument, ctx, locals);
      break;

    case "SwitchStatement":
      getExprDepsImpl(ast.discriminant, ctx, locals);
      for (const caseClause of ast.cases) {
        if (caseClause.test) getExprDepsImpl(caseClause.test, ctx, locals);
        const innerLocals6 = new Set(locals);
        for (const stmt of caseClause.consequent) {
          getStmtDepsImpl(stmt, ctx, innerLocals6);
        }
      }
      break;

    case "ThrowStatement":
      getExprDepsImpl(ast.argument, ctx, locals);
      break;

    case "TryStatement":
      getStmtDepsImpl(ast.block, ctx, locals);
      if (ast.handler) {
        const innerLocals7 = new Set(locals);
        if (ast.handler.param)
          processLVal(ast.handler.param, ctx, innerLocals7);
        getStmtDepsImpl(ast.handler.body, ctx, locals);
      }
      if (ast.finalizer) getStmtDepsImpl(ast.finalizer, ctx, locals);
      break;

    case "VariableDeclaration":
      processVariableDeclaration(ast, ctx, locals);
      break;

    case "WhileStatement":
      const innerLocals8 = new Set(locals);
      getExprDepsImpl(ast.test, ctx, innerLocals8);
      getStmtDepsImpl(ast.body, ctx, innerLocals8);
      break;

    case "WithStatement":
      const innerLocals9 = new Set(locals);
      getExprDepsImpl(ast.object, ctx, innerLocals9);
      getStmtDepsImpl(ast.body, ctx, innerLocals9);
      break;

    case "ClassDeclaration":
      throw new Error("Not implemented: ClassDeclaration");

    case "ExportAllDeclaration":
      break;

    case "ExportDefaultDeclaration":
      if (t.isExpression(ast.declaration)) {
        getExprDepsImpl(ast.declaration, ctx, locals);
      } else {
        getStmtDepsImpl(ast.declaration, ctx, locals);
      }
      break;

    case "ExportNamedDeclaration":
      if (ast.declaration) {
        getStmtDepsImpl(ast.declaration, ctx, locals);
      } else if (ast.source) {
        // export { a, b } from "module";
      } else {
        for (const specifier of ast.specifiers) {
          if (specifier.type === "ExportSpecifier") {
            getExprDepsImpl(specifier.local, ctx, locals);
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
      getExprDepsImpl(ast.right, ctx, locals);
      if (ast.left.type === "VariableDeclaration") {
        processVariableDeclaration(ast.left, ctx, locals);
      } else {
        processLVal(ast.left, ctx, locals);
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
          getExprDepsImpl(member.initializer, ctx, locals);
        }
      }
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function getExprDepsImpl(
  ast: t.Expression,
  ctx: GetDepsContext,
  locals: ReadonlySet<string>,
) {
  switch (ast.type) {
    case "ArrayExpression":
      for (const element of ast.elements) {
        if (!element) continue;
        if (element.type === "SpreadElement") {
          getExprDepsImpl(element.argument, ctx, locals);
        } else {
          getExprDepsImpl(element, ctx, locals);
        }
      }
      break;

    case "AssignmentExpression":
      if (ast.left.type === "OptionalMemberExpression") {
        getExprDepsImpl(ast.left, ctx, locals);
      } else {
        processLVal(ast.left, ctx, locals);
      }
      getExprDepsImpl(ast.right, ctx, locals);
      break;

    case "BinaryExpression":
      if (ast.left.type !== "PrivateName") {
        getExprDepsImpl(ast.left, ctx, locals);
      }
      getExprDepsImpl(ast.right, ctx, locals);
      break;

    case "CallExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      getExprDepsImpl(ast.callee, ctx, locals);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, locals);
      }
      break;

    case "ConditionalExpression":
      getExprDepsImpl(ast.test, ctx, locals);
      getExprDepsImpl(ast.consequent, ctx, locals);
      getExprDepsImpl(ast.alternate, ctx, locals);
      break;

    case "FunctionExpression":
      const innerLocals = new Set(locals);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerLocals);
      }
      getStmtDepsImpl(ast.body, ctx, innerLocals);
      break;

    case "Identifier":
      if (!locals.has(ast.name)) {
        ctx.getting(ast.name, src =>
          src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name)),
        );
      }
      break;

    case "LogicalExpression":
      getExprDepsImpl(ast.left, ctx, locals);
      getExprDepsImpl(ast.right, ctx, locals);
      break;

    case "MemberExpression":
      getExprDepsImpl(ast.object, ctx, locals);
      if (ast.property.type !== "PrivateName") {
        getExprDepsImpl(ast.property, ctx, locals);
      }
      break;

    case "NewExpression":
      if (ast.callee.type === "V8IntrinsicIdentifier") {
        throw new Error("Not implemented: " + ast.callee.name);
      }
      getExprDepsImpl(ast.callee, ctx, locals);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, locals);
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
              if (!locals.has(name)) {
                ctx.getting(name, src =>
                  src.update(
                    property.key.start!,
                    property.key.end!,
                    `${name}:${getLocalsAccessor(name)}`,
                  ),
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                getExprDepsImpl(property.key, ctx, locals);
              }
              const value = property.value;
              if (t.isExpression(value)) {
                getExprDepsImpl(value, ctx, locals);
              } else {
                processLVal(value, ctx, locals);
              }
            }
            break;
          case "SpreadElement":
            getExprDepsImpl(property.argument, ctx, locals);
            break;
          case "ObjectMethod":
            const innerLocals2 = new Set(locals);
            for (const param of property.params) {
              processLVal(param, ctx, innerLocals2);
            }
            getStmtDepsImpl(property.body, ctx, innerLocals2);
            break;
          default:
            const _exhaustiveCheck: never = property;
        }
      }
      break;

    case "SequenceExpression":
      for (const expression of ast.expressions) {
        getExprDepsImpl(expression, ctx, locals);
      }
      break;

    case "ParenthesizedExpression":
      getExprDepsImpl(ast.expression, ctx, locals);
      break;

    case "ThisExpression":
      break;

    case "UnaryExpression":
      getExprDepsImpl(ast.argument, ctx, locals);
      break;

    case "UpdateExpression":
      getExprDepsImpl(ast.argument, ctx, locals);
      break;

    case "ArrowFunctionExpression":
      const innerLocals3 = new Set(locals);
      for (const param of ast.params) {
        processDeclarationId(param, ctx, innerLocals3);
      }
      if (ast.body.type === "BlockStatement") {
        getStmtDepsImpl(ast.body, ctx, innerLocals3);
      } else {
        getExprDepsImpl(ast.body, ctx, innerLocals3);
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
      getExprDepsImpl(ast.tag, ctx, locals);
      getExprDepsImpl(ast.quasi, ctx, locals);
      break;

    case "TemplateLiteral":
      for (const expression of ast.expressions) {
        if (t.isExpression(expression)) {
          getExprDepsImpl(expression, ctx, locals);
        }
      }
      break;

    case "YieldExpression":
      if (ast.argument) {
        getExprDepsImpl(ast.argument, ctx, locals);
      }
      break;

    case "AwaitExpression":
      getExprDepsImpl(ast.argument, ctx, locals);
      break;

    case "OptionalMemberExpression":
      getExprDepsImpl(ast.object, ctx, locals);
      getExprDepsImpl(ast.property, ctx, locals);
      break;

    case "OptionalCallExpression":
      getExprDepsImpl(ast.callee, ctx, locals);
      for (const arg of ast.arguments) {
        processArgument(arg, ctx, locals);
      }
      break;

    case "TypeCastExpression":
      getExprDepsImpl(ast.expression, ctx, locals);
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
      getExprDepsImpl(ast.expression, ctx, locals);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processLVal(
  ast: t.LVal,
  ctx: GetDepsContext,
  locals: ReadonlySet<string>,
) {
  switch (ast.type) {
    case "Identifier":
      if (!locals.has(ast.name))
        ctx.setting(ast.name, src =>
          src.update(ast.start!, ast.end!, getLocalsAccessor(ast.name)),
        );
      break;

    case "MemberExpression":
      getExprDepsImpl(ast.object, ctx, locals);
      if (ast.property.type !== "PrivateName") {
        getExprDepsImpl(ast.property, ctx, locals);
      }
      break;

    case "RestElement":
      processLVal(ast.argument, ctx, locals);
      break;

    case "AssignmentPattern":
      processLVal(ast.left, ctx, locals);
      getExprDepsImpl(ast.right, ctx, locals);
      break;

    case "ArrayPattern":
      for (const element of ast.elements) {
        if (element) processLVal(element, ctx, locals);
      }
      break;

    case "ObjectPattern":
      for (const property of ast.properties) {
        switch (property.type) {
          case "RestElement":
            processLVal(property, ctx, locals);
            break;
          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error("Object property must be an identifier");
              const name = property.key.name;
              if (!locals.has(name)) {
                ctx.setting(name, src =>
                  src.update(
                    property.key.start!,
                    property.key.end!,
                    `${name}:${getLocalsAccessor(name)}`,
                  ),
                );
              }
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                getExprDepsImpl(property.key, ctx, locals);
              }
              const value = property.value;
              if (t.isPatternLike(value)) {
                processLVal(value, ctx, locals);
              } else {
                getExprDepsImpl(value, ctx, locals);
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
      getExprDepsImpl(ast.expression, ctx, locals);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processDeclarationId(
  ast: t.LVal,
  ctx: GetDepsContext,
  bindings: Set<string>,
) {
  switch (ast.type) {
    case "Identifier":
      bindings.add(ast.name);
      break;

    case "MemberExpression":
      throw new Error(`Unsupported declaration type: ${ast.type}`);

    case "RestElement":
      if (ast.argument.type !== "Identifier")
        throw new Error("Rest element must be an identifier in variable decl");
      bindings.add(ast.argument.name);
      break;

    case "AssignmentPattern":
      processDeclarationId(ast.left, ctx, bindings);
      // let { a = a } = {}; should throw ReferenceError.
      getExprDepsImpl(ast.right, ctx, bindings);
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
            bindings.add(property.argument.name);
            break;

          case "ObjectProperty":
            if (property.shorthand) {
              if (property.key.type !== "Identifier")
                throw new Error(
                  "Object property must be an identifier in variable decl",
                );
              bindings.add(property.key.name);
            } else {
              if (property.key.type !== "PrivateName" && property.computed) {
                getExprDepsImpl(property.key, ctx, bindings);
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
      getExprDepsImpl(ast.expression, ctx, bindings);
      break;

    default:
      const _exhaustiveCheck: never = ast;
  }
}

function processVariableDeclaration(
  ast: t.VariableDeclaration,
  ctx: GetDepsContext,
  bindings: Set<string>,
) {
  const declarations = ast.declarations;
  for (const declaration of declarations) {
    if (declaration.init) getExprDepsImpl(declaration.init, ctx, bindings);
    processDeclarationId(declaration.id, ctx, bindings);
  }
}

function processArgument(
  ast:
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.ArgumentPlaceholder,
  ctx: GetDepsContext,
  bindings: ReadonlySet<string>,
) {
  if (t.isJSXNamespacedName(ast)) {
  } else if (ast.type === "SpreadElement") {
    getExprDepsImpl(ast.argument, ctx, bindings);
  } else if (ast.type === "ArgumentPlaceholder") {
    throw new Error("Not implemented: " + ast.type);
  } else {
    getExprDepsImpl(ast, ctx, bindings);
  }
}
