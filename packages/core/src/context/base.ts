import type { App, RefTreeNode } from "../app";
import { Component, isComponentCtor } from "../component";
import { AppState } from "../constants";
import { Ref } from "../data";
import type { RecvContext } from "./recv";
import type { UpdateContext } from "./update";

export type ContextMemberFactory<F = (...args: any) => any> = (
  ckey: string,
  app: App,
) => F;

/**
 * The **transformed** context funcs.
 *
 * **Note**: The values of this interface should be in the transformed form,
 *  i.e. without the `ckey` parameter.
 */
export interface ContextFuncs {
  <K extends keyof this>(name: K): this[K];
  <K extends keyof IntrinsicBaseContext>(name: K): IntrinsicBaseContext[K];
  <C extends Component>(ctor: new () => C): C["$main"];
  <V>(callee: ContextMemberFactory<V>): V;
  (ignore: null | undefined): undefined;
}

/**
 * Get the real context function type from the transformed context function type.
 *  i.e. add the `ckey` parameter.
 *
 * **Note**: If the name starts with `$`, it will be ignored,
 *  because it won't be transformed.
 */
export type ToRealContextFunc<N extends keyof ContextFuncs> =
  N extends `$${string}`
    ? never
    : ContextFuncs[N] extends (...args: infer Args) => infer RetVal
    ? (ckey: string, ...args: Args) => RetVal
    : never;

/**
 * The real context functions.
 *
 * **Note**: The type is not precise for performance reasons in type checking.
 */
export type RealContextFuncs = Record<
  string,
  (ckey: string, ...args: any) => unknown
>;

/**
 * The base class of contexts.
 *
 * **Note**: This class does not contain context funcs,
 *  which is transformed into `_.$$` calls in the compiled code.
 *  Use `ToFullContext` to add context funcs to the context,
 *  so that users can call them.
 */
export interface IntrinsicBaseContext {
  /**
   * The app instance of this context.
   */
  $app: App;

  /**
   * The state of the app.
   */
  $appState: AppState;

  /**
   * Get the context itself.
   */
  _: Context;

  /**
   * The lowlevel context.
   */
  $lowlevel: IntrinsicBaseContext;

  /**
   * If the context is in `UPDATE` state, it is the update context.
   *
   * If the context is in `RECV` state, it is `null`.
   */
  $updateContext: UpdateContext | null;

  /**
   * If the context is in `RECV` state, it is the recv context.
   *
   * If the context is in `UPDATE` state, it is `null`.
   */
  $recvContext: RecvContext | null;

  /**
   * The current ref tree node.
   *
   * Used to get the instance by whether the context function is called.
   */
  $$currentRefNode: RefTreeNode;

  /**
   * Lifetime: one `UPDATE` or `RECV` call.
   *
   * Can be accessed in hooks like `beforeMain` and `afterModifyDOM`.
   *
   *
   * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
   *  which is not scoped to the inner content,
   *  use `_.provide` to provide values to `_.$runtimeData` instead.
   */
  $runtimeData: Record<symbol, unknown>;

  /**
   * Usage:
   * 1. To check if a component is processed for multiple times;
   * 2. To decide whether to dispose a component.
   */
  $$processedComponents: Set<string>;

  /**
   * If there is something not applied, warn it and reset it.
   */
  $$assertEmpty(): void;

  /**
   * The component representing the root element of the app.
   *
   * You can use this component to add classes, styles and event listeners to the root element.
   */
  $root: App["root"];

  /**
   * The component representing the document body.
   *
   * You can use this component to add classes, styles and event listeners to the document body.
   */
  $body: App["body"];

  /**
   * The component representing the document body.
   *
   * You can use this component to add event listeners to window.
   */
  $window: App["window"];

  /**
   * Ref the next component.
   *
   * Use `&&` to connect the ref call and the corresponding component call,
   *  so that TypeScript can check whether the type of the `Ref` object is correct.
   *
   * You can either ref a component or a DOM component.
   *
   * @example
   * ```ts
   * const componentRef = ref<MyComponent>();
   * const divRef = elementRef<<"div">>();
   * // ...
   * _.$ref(componentRef) && _._myComponent();
   * _.$ref(divRef) && _._div();
   * ```
   * @param ref The `Ref` object.
   * @param refs The rest `Ref` objects to merge.
   * @returns always `true`.
   */
  $ref<C>(ref: Ref<C>, ...refs: Ref<C>[]): true;

  /**
   * Set properties of the next component.
   *
   * **Note**: The properties set by this function
   *  is declared in the type parameter of the `Component` class,
   *  and accessed by `this.$props` in the component.
   *
   * @param props The properties to set.
   * @returns always `true`.
   */
  $props(props: Record<string | number | symbol, unknown>): true;

  /**
   * Add classes to the next component.
   *
   * @example
   * ```ts
   * _.$cls(titleCls);
   * _.span("Hello world!");
   * ```
   * @param cls The classes to add.
   * @returns always `true`.
   */
  $cls(cls: string): true;
  /**
   * Add classes to the next component using template literals.
   *
   * @example
   * ```ts
   * _.$cls`block text-center text-2xl`;
   * _.span("Hello world!");
   * ```
   * @param template The template literals.
   * @param args The arguments to pass to the template literals.
   * @returns always `true`.
   */
  $cls(template: TemplateStringsArray, ...args: unknown[]): true;

  /**
   * Add styles to the next component.
   *
   * **Note**: It is not required to add a semicolon (`;`) at the end of the style.
   *
   * @example
   * ```ts
   * _.$css("color: red");
   * _.span("Hello world!");
   * ```
   * @param css The styles to add.
   */
  $css(css: string): true;
  /**
   * Add styles to the next component using template literals.
   *
   * **Note**: It is not required to add a semicolon (`;`) at the end of the style.
   *
   * @example
   * ```ts
   * _.$css`color: red`;
   * _.span("Hello world!");
   * ```
   * @param template The template literals.
   * @param args The arguments to pass to the template literals.
   */
  $css(template: TemplateStringsArray, ...args: unknown[]): true;

  /**
   * Set the id of the next element.
   *
   * @param id The id to set.
   */
  $id(id: string): true;
  $id(template: TemplateStringsArray, ...args: unknown[]): true;

  /**
   * Add attributes to the next element.
   *
   * @param attrs The attributes to add.
   */
  $attrs<T extends object>(attrs: T): true;

  /**
   * The transformed context function calls (excluding `_.t` calls).
   *
   * A unique key is generated for each call in source code,
   *  and passed to the `ckey` parameter of this function.
   *
   * @example
   * ```ts
   * // Before transformation
   * _._div({}, "Content");
   *
   * // After transformation
   * _.$$("_div", "E-3", {}, "Content");
   * ```
   * @param ckey The unique key of this call in source code.
   * @param funcName The name of the context function.
   * @param args The arguments of the context function.
   * @returns The return value of the context function.
   */
  $$c(ckey: string, funcName: string, ...args: unknown[]): unknown;

  /**
   * The transformed `_.t` calls.
   *
   * A unique key is generated for each call in source code,
   *  and passed to the `ckey` parameter of this function.
   *
   * @example
   * ```ts
   * // Before transformation
   * _.t`Content`;
   * _.t("Content");
   *
   * // After transformation
   * _.$$t("E-3", `Content`);
   * _.$$t("E-4", "Content");
   * ```
   * @param ckey The unique key of this call in source code.
   * @param content The content to render.
   */
  $$t(ckey: string, content: string | number | boolean): void;

  /**
   * The transformed `_(...)` calls.
   *
   * A unique key is generated for each call in source code,
   *  and passed to the `ckey` parameter of this function.
   *
   * @example
   * ```ts
   * // Before transformation
   * _("$cls")
   * _("_div")
   * _(myComponent)
   *
   * // After transformation
   * _.$$d("E-3", "$cls")
   * _.$$d("E-4", "_div")
   * _.$$d("E-5", myComponent)
   * ```
   * @param ckey The unique key of this call in source code.
   * @param name The name of the context function.
   * @param callee The called function as a context function.
   * @returns The curresponding context property or context function.
   */
  $$d<K extends keyof this>(ckey: string, name: K): this[K];
  $$d<K extends keyof IntrinsicBaseContext>(
    ckey: string,
    name: K,
  ): IntrinsicBaseContext[K];
  $$d<C extends Component>(ckey: string, ctor: new () => C): C["$main"];
  $$d<V>(ckey: string, callee: ContextMemberFactory<V>): V;

  /**
   * Process a component.
   *
   * @param ckey The Ckey of the component.
   * @param ctor The constructor of the component class.
   * @param factory The factory function of the component.
   * @param args The parameters to pass to the main function of the component.
   * @returns The component instance.
   */
  $$processComponent<T extends Component>(
    ckey: string,
    ctor: new () => T,
    args: unknown[],
  ): unknown;
}

/**
 * The full context type, with context funcs.
 */
export type Context = Readonly<Omit<IntrinsicBaseContext, `$$${string}`>> &
  ContextFuncs;

/**
 * Initialize a context.
 *
 * @param app The app instance.
 */
export function initializeBaseContext(app: App) {
  const context = _ as unknown as IntrinsicBaseContext;

  context._ = context as unknown as Context;
  context.$app = app;
  context.$root = app.root;
  context.$body = app.body;
  context.$window = app.window;
  context.$appState = app.state;
  context.$lowlevel = context;
  context.$runtimeData = {};

  context.$$currentRefNode = app.root.$refTreeNode;
  context.$$processedComponents = new Set();

  context.$$d = (
    ckey: string,
    callee:
      | keyof ContextFuncs
      | keyof IntrinsicBaseContext
      | (new () => Component)
      | ContextMemberFactory<any>
      | null
      | undefined,
  ) => {
    if (callee === null || callee === undefined) {
      return undefined;
    } else if (typeof callee === "function") {
      if (isComponentCtor(callee)) {
        return (...args: any) => context.$$processComponent(ckey, callee, args);
      } else {
        return callee(ckey, app);
      }
    } else if (typeof callee === "symbol" || String(callee)[0] === "$") {
      const member = context[callee as keyof typeof context];
      if (typeof member === "function") {
        return member.bind(context);
      } else {
        return member;
      }
    } else if (callee === "t") {
      return (...args: any) => {
        context.$$t(
          ckey,
          Array.isArray(args[0])
            ? String.raw({ raw: args[0] }, ...args.slice(1))
            : args[0],
        );
      };
    } else {
      return (...args: unknown[]) => {
        context.$$c(ckey, callee, ...args);
      };
    }
  };
}

/**
 * Mark the context as invalid.
 */
export function invalidateContext() {
  const context = _ as unknown as IntrinsicBaseContext;
  context.$app = null as any;
  context.$appState = null as any;
  context.$lowlevel = null as any;
  context.$$currentRefNode = null as any;
  context.$runtimeData = null as any;
  context.$$processedComponents = null as any;
  context.$root = null as any;
  context.$body = null as any;
  context.$window = null as any;

  const warningFunc = (): any => {
    console.warn("This context is cleared!");
  };

  context.$props = warningFunc;
  context.$cls = warningFunc;
  context.$css = warningFunc;
  context.$ref = warningFunc;
  context.$$assertEmpty = warningFunc;
  context.$$d = warningFunc;
  context.$$c = warningFunc;
  context.$$t = warningFunc;
}

export function $contextFunc<F extends (...args: any[]) => any>(
  func: ContextMemberFactory<F>,
) {
  return func;
}

export const _: Context = {} as any;
