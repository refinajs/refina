import type { App, RefTreeNode } from "../app";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentMainFunc,
} from "../component";
import { AppState } from "../constants";
import { Model, Ref } from "../data";
import type { RecvContext } from "./recv";
import type { UpdateContext } from "./update";

/**
 * The state of a context.
 *
 * **Note**: This is only used in type checking.
 *
 * Use declaration merging to add properties to this interface.
 */
export interface ContextState {
  /**
   * The current mode of the context.
   *
   * - `build`: The context is building the next component,
   *    i.e. the type of the next component is unknown.
   * - `fill`: The context is filling the current component,
   *    i.e. the type of the current component is known.
   */
  mode: "build" | "fill";

  /**
   * The enabled components.
   *
   * Only component functions whose instance type extends this type can be called,
   *  otherwise the component function will be of type `never`.
   */
  enabled: any;
}

/**
 * The initial state of a context.
 *
 * Use declaration merging to add properties to this interface.
 */
export interface InitialContextState extends ContextState {
  mode: "build";
  enabled: {};
}

/**
 * The **transformed** context funcs.
 *
 * **Note**: The values of this interface should be in the transformed form,
 *  i.e. without the `ckey` parameter.
 *
 * ---
 *
 * *Usage 1*:
 * Your component has a generic type,
 *  so you cannot add it to a specific component interface like `OutputComponents`.
 *
 * @example
 * ```ts
 * export class MyComponent<T> extends OutputComponent {
 *   main(_: Context, value: T): void {
 *     // ...
 *   }
 * }
 *
 * declare module "refina" {
 *   interface ContextFuncs<C> {
 *     myComponent: MyComponent<any> extends C["enabled"]
 *       ? <T>(value: T) => void
 *       : never;
 *   }
 * }
 * ```
 * **Warning**: Be carefull with the return value of the component function.
 *
 * ---
 *
 * *Usage 2*:
 * Add a non-component utility function to the context.
 *
 * @example
 * ```ts
 * MyPlugin.registerFunc("myFunc", <T>(ckey: string, value: T) => {
 *   // ...
 * });
 *
 * declare module "refina" {
 *   interface ContextFuncs<C> {
 *     myFunc: never extends C["enabled"]
 *       ? <T>(ckey: string, value: T) => void
 *       : never;
 *   }
 * }
 * ```
 */
export interface ContextFuncs<C extends ContextState> {}

/**
 * Get the real context function type from the transformed context function type.
 *  i.e. add the `ckey` parameter.
 *
 * **Note**: If the name starts with `$`, it will be ignored,
 *  because it won't be transformed.
 */
export type ToRealContextFunc<
  N extends keyof ContextFuncs<any>,
  Ctx = LowlevelContext,
> = N extends `$${string}`
  ? never
  : ContextFuncs<any>[N] extends (...args: infer Args) => infer RetVal
  ? (this: Ctx, ckey: string, ...args: Args) => RetVal
  : never;

/**
 * The real context functions.
 *
 * **Note**: The type is not precise for performance reasons in type checking.
 */
export type RealContextFuncs<Ctx = IntrinsicBaseContext> = Record<
  string,
  (this: Ctx, ckey: string, ...args: unknown[]) => unknown
>;

/**
 * A utility type to get the enabled props type from the context state.
 */
export type EnabledProps<C extends ContextState> = C["mode"] extends "build"
  ? C["enabled"] extends {
      $props: infer T;
    }
    ? Record<string | number | symbol, any> & Record<keyof T, never>
    : Record<string | number | symbol, any>
  : C["enabled"] extends {
      $props: infer T;
    }
  ? T
  : {};

/**
 * The base class of contexts.
 *
 * **Note**: This class does not contain context funcs,
 *  which is transformed into `_.$$` calls in the compiled code.
 *  Use `ToFullContext` to add context funcs to the context,
 *  so that users can call them.
 */
export interface IntrinsicBaseContext<
  CS extends ContextState = InitialContextState,
> {
  /**
   * The app instance of this context.
   */
  $app: App;

  /**
   * The state of the app.
   */
  $appState: AppState;

  /**
   * The state of the context.
   *
   * Not exist in runtime.
   *
   * This is essential for `this is Context<...>` to work correctly.
   */
  $tsContextState: CS;

  /**
   * Get the context itself with empty ContextState.
   */
  _: Context;

  /**
   * The lowlevel context.
   */
  $lowlevel: LowlevelContext;

  /**
   * If the context is in `UPDATE` state, it is the update context.
   *
   * If the context is in `RECV` state, it is `null`.
   */
  $updateContext: UpdateContext<CS> | null;

  /**
   * If the context is in `RECV` state, it is the recv context.
   *
   * If the context is in `UPDATE` state, it is `null`.
   */
  $recvContext: RecvContext<CS> | null;

  /**
   * Trigger an `UPDATE` call.
   */
  $update: App["update"];

  /**
   * Set the value of a model and trigger an `UPDATE` call if the value is changed.
   *
   * @param model The model.
   * @param v The new value.
   * @returns Whether the value is changed.
   */
  $updateModel: App["updateModel"];

  /**
   * The shortcut of `app.permanentData`.
   *
   * Lifetime: from the construction of the app to the window is closed.
   */
  $permanentData: App["permanentData"];

  /**
   * The current ref tree node.
   *
   * Used to get the instance by whether the context function is called.
   */
  $$currentRefTreeNode: RefTreeNode;

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
   * const divRef = ref<HTMLElementComponent<"div">>();
   * // ...
   * _.$ref(componentRef) && _._myComponent();
   * _.$ref(divRef) && _._div();
   * ```
   * @param ref The `Ref` object.
   * @param refs The rest `Ref` objects to merge.
   * @returns always `true`.
   */
  $ref<C2 extends CS["enabled"]>(
    ref: Ref<C2>,
    ...refs: Ref<C2>[]
  ): this is Context<{
    mode: "fill";
    enabled: C2;
  }>;

  /**
   * Set a property of the next component.
   *
   * **Note**: The property set by this function
   *  is declared in the type parameter of the `Component` class,
   *  and accessed by `this.$props` in the component.
   *
   * @param key The key of the property to set.
   * @param value The value of the property to set.
   * @returns always `true`.
   */
  $prop<K extends keyof EnabledProps<CS>, V extends EnabledProps<CS>[K]>(
    key: K,
    value: V,
  ): true;

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
  $props<Props extends EnabledProps<CS>>(props: Props): true;

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
  $$d<K extends keyof this["$lowlevel"]>(
    ckey: string,
    name: K,
  ): this["$lowlevel"][K];
  $$d<V>(ckey: string, callee: (this: this, ckey: string) => V): V;

  /**
   * Process a component.
   *
   * @param ckey The Ckey of the component.
   * @param ctor The constructor of the component class.
   * @param factory The factory function of the component.
   * @param args The parameters to pass to the main function of the component.
   * @returns The component instance.
   */
  $$processComponent<T extends Component<any>>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    factory: (this: T, context: ComponentContext<any>) => ComponentMainFunc,
    args: unknown[],
  ): T;
}

interface ContextDirectCall {
  <V>(callee: (this: IntrinsicBaseContext, ckey: string) => V): V;
  <K extends keyof this>(name: K): this[K];
}

/**
 * The full context type, with context funcs.
 */
export type Context<CS extends ContextState = InitialContextState> = Readonly<
  Omit<IntrinsicBaseContext<CS>, `$$${string}`>
> &
  ContextFuncs<CS> &
  ContextDirectCall;

/**
 * The full context type, with context funcs and lowlevel APIs.
 */
export type LowlevelContext<CS extends ContextState = InitialContextState> =
  IntrinsicBaseContext<CS> & ContextFuncs<CS>;

/**
 * Initialize a context.
 * @param context The context to initialize.
 * @param app The app instance.
 */
export function initializeBaseContext(context: IntrinsicBaseContext, app: App) {
  context._ = context as unknown as Context;
  context.$app = app;
  context.$appState = app.state;
  context.$lowlevel = context as unknown as LowlevelContext;
  context.$update = app.update;
  context.$updateModel = app.updateModel;
  context.$permanentData = app.permanentData;

  if (import.meta.env.DEV) {
    // Proxy `context.$$currentRefTreeNode` to unref removed ckeys.
    let currentRefTreeNode = app.root.$refTreeNode;
    Object.defineProperty(context, "$$currentRefTreeNode", {
      get() {
        return currentRefTreeNode;
      },
      set(node) {
        currentRefTreeNode = node;
        if (window.__REFINA_HMR__) {
          for (const ckey of window.__REFINA_HMR__.removedCkeys) {
            delete node[ckey];
          }
        }
      },
      configurable: true,
    });
  } else {
    context.$$currentRefTreeNode = app.root.$refTreeNode;
  }

  context.$runtimeData = {};
  context.$$processedComponents = new Set();
  context.$root = app.root;
  context.$body = app.body;
  context.$window = app.window;

  context.$$d = (
    ckey: string,
    nameOrCallee:
      | keyof LowlevelContext
      | ((this: IntrinsicBaseContext, ckey: string) => unknown),
  ) => {
    if (typeof nameOrCallee === "function") {
      return nameOrCallee.call(context, ckey);
    } else if (
      typeof nameOrCallee === "symbol" ||
      String(nameOrCallee)[0] === "$"
    ) {
      const member = context[nameOrCallee as keyof typeof context];
      if (typeof member === "function") {
        return member.bind(context);
      } else {
        return member;
      }
    } else if (nameOrCallee === "t") {
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
        context.$$c(ckey, nameOrCallee, ...args);
      };
    }
  };
}
