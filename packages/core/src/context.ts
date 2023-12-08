import type {
  AppRecvState,
  AppRunningState,
  AppUpdateState,
  RunningApp,
} from "./app";
import { Component, ComponentConstructor } from "./component";
import { AppStateType } from "./constants";
import { D, Ref, getD, mergeRefs } from "./data";
import {
  Content,
  DOMElementComponent,
  DOMElementEventListenersInfoRaw,
  DOMNodeComponent,
  SVGElementFuncData,
  TextNodeComponent,
} from "./dom";

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
type EnabledProps<C extends ContextState> = C["mode"] extends "build"
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
 * Create a full context type from an intrinsic context type.
 */
export type ToFullContext<I, CS extends ContextState> = I & ContextFuncs<CS>;

/**
 * The base class of contexts.
 *
 * **Note**: This class does not contain context funcs,
 *  which is transformed into `_.$$` calls in the compiled code.
 *  Use `ToFullContext` to add context funcs to the context,
 *  so that users can call them.
 */
export class IntrinsicContext<CS extends ContextState> {
  /**
   * @param $app The app instance of this context.
   */
  constructor(public readonly $app: RunningApp) {}

  /**
   * The state of the context.
   *
   * Not exist in runtime.
   *
   * This is essential for `this is Context<...>` to work correctly.
   */
  declare $tsContextState: CS;

  /**
   * Get the context itself with empty ContextState.
   */
  get _() {
    return this as unknown as Context;
  }

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
   * The current state of the app.
   */
  get $state(): AppRunningState {
    return this.$app.state;
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
  get $updateState(): AppUpdateState | null {
    return this.$app.state.type === AppStateType.UPDATE
      ? this.$app.state
      : null;
  }

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
  get $recvState(): AppRecvState | null {
    return this.$app.state.type === AppStateType.RECV ? this.$app.state : null;
  }

  /**
   * The event that the app is receiving.
   *
   * **Note**: This property always exists in runtime,
   *  but being invisible in type until a truthy check of the return value of a trigger component function.
   */
  get $ev(): any {
    if (this.$app.state.type === AppStateType.RECV) {
      return this.$app.state.event;
    } else {
      throw new Error(`Cannot access _.$ev when not receiving event.`);
    }
  }

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
  $ref<C2 extends CS["enabled"]>(
    ref: Ref<C2>,
    ...refs: Ref<C2>[]
  ): this is Context<{
    mode: "fill";
    enabled: C2;
  }> {
    if (this.$updateState) {
      this.$$nextRef = refs.length === 0 ? ref : mergeRefs(ref, ...refs);
    }
    return true;
  }

  /**
   * The `Ref` object of the next component.
   */
  protected $$nextRef: Ref<any> | null = null;

  /**
   * Fulfill `this.$$nextRef` with the given value,
   *  and clear `this.$$nextRef`.
   *
   * @param current The value to fulfill.
   */
  $$fulfillRef(current: any) {
    if (this.$$nextRef !== null) {
      this.$$nextRef.current = current;
      this.$$nextRef = null;
    }
  }

  /**
   * Fulfill the pending main element owners with the given main element,
   *  and clear the pending main element owners list.
   *
   * @param mainEl The main element to fulfill.
   */
  $$fulfillMainEl(mainEl: DOMElementComponent) {
    const updateState = this.$updateState!;
    for (const owner of updateState.pendingMainElOwner) {
      owner.$mainEl = mainEl;
    }
    updateState.pendingMainElOwner = [];
  }

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
  ): true {
    if (this.$updateState) {
      this.$$nextProps[key] = value;
    }
    return true;
  }

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
  $props<Props extends EnabledProps<CS>>(props: Props): true {
    if (this.$updateState) {
      Object.assign(this.$$nextProps, props);
    }
    return true;
  }

  /**
   * The properties that will be set to the next component.
   */
  protected $$nextProps: Record<string | number | symbol, any> = {};

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
  $cls(template: TemplateStringsArray, ...args: any[]): true;
  $cls(...args: any[]): true {
    if (this.$updateState) {
      this.$$nextCls +=
        (Array.isArray(args[0])
          ? String.raw({ raw: args[0] }, ...args.slice(1))
          : args[0]) + " ";
    }
    return true;
  }

  /**
   * The classes that will be added to the next component.
   */
  protected $$nextCls: string = "";

  /**
   * Get the classes that will be added to the next component,
   *  and clear `this.$$nextCls`.
   *
   * @returns The classes.
   */
  protected $$consumeCls() {
    const cls = this.$$nextCls;
    this.$$nextCls = "";
    return cls;
  }

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
  $css(template: TemplateStringsArray, ...args: any[]): true;
  $css(...args: any[]): true {
    if (this.$updateState) {
      this.$$nextCss +=
        (Array.isArray(args[0])
          ? String.raw({ raw: args[0] }, ...args.slice(1))
          : args[0]) + ";";
    }
    return true;
  }

  /**
   * The styles that will be added to the next component.
   */
  protected $$nextCss: string = "";

  /**
   * Get the styles that will be added to the next component,
   *  and clear `this.$$nextCss`.
   *
   * @returns The styles.
   */
  protected $$consumeCss() {
    const css = this.$$nextCss;
    this.$$nextCss = "";
    return css;
  }

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

  $$assertEmpty() {
    if (this.$$nextRef) {
      console.warn("Ref", this.$$nextRef, "is not fulfilled.");
      this.$$nextRef = null;
    }
    if (Object.keys(this.$$nextProps).length > 0) {
      console.warn("Props", this.$$nextProps, "is not fulfilled.");
      this.$$nextProps = {};
    }
    if (this.$$nextCls.length > 0) {
      console.warn("Classes", this.$$nextCls, "is not fulfilled.");
      this.$$nextCls = "";
    }
    if (this.$$nextCss.length > 0) {
      console.warn("Styles", this.$$nextCss, "is not fulfilled.");
      this.$$nextCss = "";
    }
  }

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
  $$(funcName: string, ckey: string, ...args: any[]): any {
    if (funcName[0] === "_") {
      // The context function is for a HTML or SVG element.
      const [data, inner, eventListeners] = args;

      if (
        funcName.startsWith("_svg") &&
        funcName[4].toUpperCase() === funcName[4]
      ) {
        // The context function is for a SVG element.
        const tagName = (funcName[4].toLowerCase() +
          funcName.slice(5)) as keyof SVGElementTagNameMap;
        this.$$processSVGElement(
          ckey,
          tagName,
          this.$$consumeCls(),
          this.$$consumeCss(),
          data,
          inner,
          eventListeners,
        );
      } else {
        // The context function is for a HTML element.
        const rawTagName = funcName.slice(1);
        const tagName = (this.$app.htmlElementAlias[rawTagName] ??
          rawTagName) as keyof HTMLElementTagNameMap;
        this.$$processHTMLElement(
          ckey,
          tagName,
          this.$$consumeCls(),
          this.$$consumeCss(),
          data,
          inner,
          eventListeners,
        );
      }
      // HTML and SVG element functions do not have a return value.
      return;
    }
    // The context function is for a user-defined component.
    const func = this.$app.contextFuncs[funcName as keyof RealContextFuncs];
    if (import.meta.env.DEV) {
      if (!func) {
        throw new Error(`Unknown element ${funcName}.`);
      }
    }
    // Return the return value of the context function.
    return func.call(this._, ckey, ...args);
  }

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
  $$t(ckey: string, content: D<string | number | boolean>): void {
    if (import.meta.env.DEV) {
      if (this.$$consumeCls.length > 0) {
        console.warn(`Text node cannot have classes`);
      }
      if (this.$$consumeCss.length > 0) {
        console.warn(`Text node cannot have style`);
      }
    }

    const text = String(getD(content));

    const ikey = this.$app.pushKey(ckey);
    let textNode = this.$app.refMap.get(ikey) as DOMNodeComponent | undefined;
    if (!textNode) {
      textNode = new TextNodeComponent(ikey, document.createTextNode(text));
      this.$app.refMap.set(ikey, textNode);
      this.$app.nodeMap.set(textNode.node, textNode);
    } else if (this.$updateState && textNode.node.textContent !== text) {
      textNode.node.textContent = text;
    }

    const updateState = this.$updateState;
    if (updateState) {
      this.$$fulfillRef(textNode);

      updateState.currentDOMParent.pendingChildren.push(textNode);
    }

    this.$app.popKey(ikey);
  }

  /**
   * Process a component.
   *
   * @param ckey The Ckey of the component.
   * @param ctor The constructor of the component class.
   * @param args The parameters to pass to the main function of the component.
   * @returns The component instance.
   */
  $$processComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    args: any[],
  ) {
    const ikey = this.$app.pushKey(ckey);
    let component = this.$app.refMap.get(ikey) as T | undefined;
    if (!component) {
      component = new ctor(ikey, this.$app);
      this.$app.refMap.set(ikey, component);
    }

    const updateState = this.$updateState;
    if (updateState) {
      this.$$fulfillRef(component);

      // Store the pending main element owners for this component and clear it.
      const pendingMainElOwners = updateState.pendingMainElOwner;
      updateState.pendingMainElOwner = [];

      // Store the classes and styles for this component and clear them.
      const css = this.$$consumeCss();
      const cls = this.$$consumeCls();

      component.$mainEl = undefined as DOMElementComponent | undefined;
      updateState.pendingMainElOwner.push(component);

      component.$props = this.$$nextProps;
      this.$$nextProps = {};

      try {
        component.main(this._, ...args);
        if (import.meta.env.DEV) {
          this.$$assertEmpty();
        }
      } catch (e) {
        this.$app.callHook("onError", e);
      }

      if (component.$mainEl) {
        // There is a $mainEl in the component.
        for (const owner of pendingMainElOwners) {
          // If the owner has a main element, it must be set by calling `this.$main()`.
          // So we don't need to set it to the default value.
          owner.$mainEl ??= component.$mainEl;
        }
        // All the pending main element owners are fulfilled.
        updateState.pendingMainElOwner = [];

        // Add the classes and styles to the main element.
        component.$mainEl.addCls(cls);
        component.$mainEl.addCss(css);
      } else {
        // Not append arrays to ignore pending main element owners in the inner scope.
        // Pass the pending main element owners for this component to the next component.
        updateState.pendingMainElOwner = pendingMainElOwners;
      }
    } else {
      component.main(this._, ...args);
      if (import.meta.env.DEV) {
        this.$$assertEmpty();
      }
    }

    this.$app.popKey(ikey);

    return component;
  }

  /**
   * Process the content of a DOM element component in `UPDATE` state.
   *
   * @param appState The `UPDATE` state of the app.
   * @param el The DOM element component.
   * @param content The content of the DOM element component.
   */
  $$updateDOMContent(
    appState: AppUpdateState,
    el: DOMElementComponent,
    content?: D<Content>,
  ) {
    const parent = appState.currentDOMParent;
    parent.pendingChildren.push(el);

    if (content !== undefined) {
      // Set the current DOM parent to this DOM element component.
      appState.currentDOMParent = el;

      const contentValue = getD(content);
      if (typeof contentValue === "function") {
        // The content is a view function.

        try {
          contentValue(this._);
          if (import.meta.env.DEV) {
            this.$$assertEmpty();
          }
        } catch (e) {
          this.$app.callHook("onError", e);
        }
      } else {
        // The content is a text node.
        this.$$t("_t", contentValue);
      }

      // Restore the DOM parent.
      appState.currentDOMParent = parent;
    }
  }

  /**
   * Process the content of a DOM element component in `RECV` state.
   *
   * @param content The content of the DOM element component.
   */
  $$recvDOMContent(content?: D<Content>) {
    const contentValue = getD(content);
    if (typeof contentValue === "function") {
      // The content is a view function.

      try {
        contentValue(this._);
        if (import.meta.env.DEV) {
          this.$$assertEmpty();
        }
      } catch (e) {
        this.$app.callHook("onError", e);
      }
    }
    // Text node is ignored in `RECV` state.
  }

  /**
   * Process a HTML element.
   *
   * @param ckey The Ckey of the element.
   * @param tagName The tag name of the element.
   * @param cls The classes of the element.
   * @param css The styles of the element.
   * @param data The data to assign to the element.
   * @param inner The inner content of the element.
   * @param eventListeners The event listeners of the element.
   */
  protected $$processHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    data: Partial<HTMLElementTagNameMap[E]> = {},
    inner?: D<Content>,
    eventListeners: DOMElementEventListenersInfoRaw<E> = {},
  ) {
    const ikey = this.$app.pushKey(ckey);

    let el = this.$app.refMap.get(ikey) as DOMElementComponent | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof HTMLElementTagNameMap>(
        ikey,
        document.createElement(tagName),
      );
      this.$app.refMap.set(ikey, el);
      this.$app.nodeMap.set(el.node, el);
    }

    const updateState = this.$updateState;
    if (updateState) {
      this.$$fulfillRef(el);
      this.$$fulfillMainEl(el);

      this.$$updateDOMContent(updateState, el, inner);

      for (const key in data) {
        if (data[key] === undefined) {
          // Delete the property if the value is undefined.
          // @ts-ignore
          delete el.node[key];
        } else {
          // For a HTML element, just assign the value to the property.
          // @ts-ignore
          el.node[key] = data[key];
        }
      }

      el.addCls(cls);
      el.addCss(css);
      el.addEventListeners(eventListeners);
    } else {
      this.$$recvDOMContent(inner);
    }

    this.$app.popKey(ikey);
  }

  /**
   * Process a SVG element.
   *
   * @param ckey The Ckey of the element.
   * @param tagName The tag name of the element.
   * @param cls The classes of the element.
   * @param css The styles of the element.
   * @param data The data to assign to the element.
   * @param inner The inner content of the element.
   * @param eventListeners The event listeners of the element.
   */
  protected $$processSVGElement<E extends keyof SVGElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    data: SVGElementFuncData = {},
    inner?: D<Content>,
    eventListeners: DOMElementEventListenersInfoRaw<E> = {},
  ) {
    const ikey = this.$app.pushKey(ckey);

    let el = this.$app.refMap.get(ikey) as DOMElementComponent | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof SVGElementTagNameMap>(
        ikey,
        document.createElementNS("http://www.w3.org/2000/svg", tagName),
      );
      this.$app.refMap.set(ikey, el);
      this.$app.nodeMap.set(el.node, el);
    }

    const updateState = this.$updateState;
    if (updateState) {
      this.$$fulfillRef(el);
      this.$$fulfillMainEl(el);

      this.$$updateDOMContent(updateState, el, inner);

      for (const key in data) {
        const value = data[key];
        if (value === undefined) {
          el.node.removeAttribute(key);
        } else if (typeof value === "function") {
          // Cannot stringify a function, so just assign it.
          // @ts-ignore
          el.node[key] = value;
        } else {
          // For SVG elements, all attributes are string,
          //  and just assign it to the SVGElement does not work.
          el.node.setAttribute(key, String(value));
        }
      }

      el.addCls(cls);
      el.addCss(css);
      el.addEventListeners(eventListeners);
    } else {
      this.$$recvDOMContent(inner);
    }

    this.$app.popKey(ikey);
  }
}

/**
 * The full context type, with context funcs.
 */
export type Context<CS extends ContextState = InitialContextState> =
  ToFullContext<Omit<IntrinsicContext<CS>, "$ev">, CS>;
