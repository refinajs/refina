import type {
  AppRecvState,
  AppRunningState,
  AppUpdateState,
  RunningApp,
} from "../app";
import { Component, ComponentConstructor } from "../component";
import { D, Ref } from "../data";
import { RecvContext } from "./recv";
import { UpdateContext } from "./update";

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
  Ctx = Context,
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
export type RealContextFuncs<Ctx = Context> = Record<
  string,
  (this: Ctx, ckey: string, ...args: any[]) => any
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
export abstract class IntrinsicContext<CS extends ContextState> {
  /**
   * @param $app The app instance of this context.
   */
  constructor(public readonly $app: RunningApp) {
    this.$state = $app.state;
  }

  /**
   * The current state of the app.
   */
  readonly $state: AppRunningState;

  /**
   * The state of the context.
   *
   * Not exist in runtime.
   *
   * This is essential for `this is Context<...>` to work correctly.
   */
  declare readonly $tsContextState: CS;

  /**
   * Get the context itself with empty ContextState.
   */
  abstract readonly _: Context;

  /**
   * Trigger an `UPDATE` call.
   */
  get $update() {
    return this.$app.update;
  }

  /**
   * Set the value of a `D` and trigger an `UPDATE` call if the value is changed.
   *
   * @param d The `D` to set
   * @param v The value to set
   * @returns Whether the value is changed, i.e. whether an `UPDATE` call is triggered or whether `d` is a `PD`.
   */
  get $setD() {
    return this.$app.setD;
  }

  /**
   * If the app is in `UPDATE` state, return the state. Otherwise, return `null`.
   *
   * You can check whether the app is in `UPDATE` state by `if (_.$updateState)`.
   *
   * @example
   * ```ts
   * const updateState = _.$updateState;
   * if (updateState) {
   *   // updateState is of type AppUpdateState.
   *   // ...
   * }
   * ```
   */
  abstract readonly $updateState: AppUpdateState | null;

  /**
   * If the app is in `RECV` state, return the state. Otherwise, return `null`.
   *
   * You can check whether the app is in `RECV` state by `if (_.$recvState)`.
   *
   * @example
   * ```ts
   * const recvState = _.$recvState;
   * if (recvState) {
   *   // recvState is of type AppRecvState.
   *   // ...
   * }
   * ```
   */
  abstract readonly $recvState: AppRecvState | null;

  /**
   * If the app is in `UPDATE` state, return the context itself. Otherwise, return `null`.
   *
   * You can check whether the app is in `UPDATE` state by `if (_.$updateContext)`.
   *
   * @example
   * ```ts
   * const updateContext = _.$updateContext;
   * if (updateContext) {
   *   // updateContext is of type UpdateContext.
   *   // ...
   * }
   * ```
   */
  abstract readonly $updateContext: UpdateContext<CS> | null;

  /**
   * If the app is in `RECV` state, return the context itself. Otherwise, return `null`.
   *
   * You can check whether the app is in `RECV` state by `if (_.$recvContext)`.
   *
   * @example
   * ```ts
   * const recvContext = _.$recvContext;
   * if (recvContext) {
   *   // recvContext is of type RecvContext.
   *   // ...
   * }
   * ```
   */
  abstract readonly $recvContext: RecvContext<CS> | null;

  /**
   * The component representing the root element of the app.
   *
   * You can use this component to add classes, styles and event listeners to the root element.
   */
  get $root() {
    return this.$app.root;
  }

  /**
   * The component representing the document body.
   *
   * You can use this component to add classes, styles and event listeners to the document body.
   */
  get $body() {
    return this.$app.body;
  }

  /**
   * The component representing the document body.
   *
   * You can use this component to add event listeners to window.
   */
  get $window() {
    return this.$app.window;
  }

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
  abstract $ref<C2 extends CS["enabled"]>(
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
  abstract $prop<
    K extends keyof EnabledProps<CS>,
    V extends EnabledProps<CS>[K],
  >(key: K, value: V): true;

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
  abstract $props<Props extends EnabledProps<CS>>(props: Props): true;

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
  abstract $cls(cls: string): true;
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
  abstract $cls(template: TemplateStringsArray, ...args: any[]): true;

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
  abstract $css(css: string): true;
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
  abstract $css(template: TemplateStringsArray, ...args: any[]): true;

  /**
   * The shortcut of `app.permanentData`.
   *
   * Lifetime: from the construction of the app to the window is closed.
   */
  get $permanentData() {
    return this.$app.permanentData;
  }

  /**
   * The shortcut of `app.state.runtimeData`.
   *
   * Lifetime: one `UPDATE` or `RECV` call.
   *
   * **Note**: It is usually a bad idea to write to `_.$runtimeData` directly,
   *  which is not scoped to the inner content,
   *  use `_.provide` to provide values to `_.$runtimeData` instead.
   */
  get $runtimeData() {
    return this.$app.state.runtimeData;
  }

  /**
   * If there is something not applied, warn it and reset it.
   */
  abstract $$assertEmpty(): void;

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
   * @param funcName The name of the context function.
   * @param ckey The unique key of this call in source code.
   * @param args The arguments of the context function.
   * @returns The return value of the context function.
   */
  abstract $$(funcName: string, ckey: string, ...args: any[]): any;

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
  abstract $$t(ckey: string, content: D<string | number | boolean>): void;

  /**
   * Process a component.
   *
   * @param ckey The Ckey of the component.
   * @param ctor The constructor of the component class.
   * @param args The parameters to pass to the main function of the component.
   * @returns The component instance.
   */
  abstract $$processComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    args: any[],
  ): T;
}

/**
 * The full context type, with context funcs.
 */
export type Context<CS extends ContextState = InitialContextState> =
  IntrinsicContext<CS> & ContextFuncs<CS>;
