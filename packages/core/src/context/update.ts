import type { AppUpdateState, RunningApp } from "../app";
import { Component, ComponentConstructor } from "../component";
import { D, Ref, getD, mergeRefs } from "../data";
import {
  Content,
  DOMElementComponent,
  DOMElementEventListenersInfoRaw,
  DOMNodeComponent,
  SVGElementFuncData,
  TextNodeComponent,
} from "../dom";
import {
  Context,
  ContextFuncs,
  ContextState,
  EnabledProps,
  InitialContextState,
  IntrinsicContext,
  RealContextFuncs,
} from "./base";

export class IntrinsicUpdateContext<
  CS extends ContextState,
> extends IntrinsicContext<CS> {
  constructor($app: RunningApp) {
    super($app);
    this.$updateState = this.$state;
  }

  declare readonly $state: AppUpdateState;

  readonly _: UpdateContext = this as unknown as UpdateContext;

  readonly $updateState: AppUpdateState;

  readonly $recvState: null = null;

  readonly $updateContext: UpdateContext<CS> = this
    ._ as unknown as UpdateContext<CS>;

  readonly $recvContext: null = null;

  $ref<C2 extends CS["enabled"]>(
    ref: Ref<C2>,
    ...refs: Ref<C2>[]
  ): this is Context<{
    mode: "fill";
    enabled: C2;
  }> {
    this.$$nextRef = refs.length === 0 ? ref : mergeRefs(ref, ...refs);
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
    for (const owner of this.$state.pendingMainElOwner) {
      owner.$mainEl = mainEl;
    }
    this.$state.pendingMainElOwner = [];
  }

  $prop<K extends keyof EnabledProps<CS>, V extends EnabledProps<CS>[K]>(
    key: K,
    value: V,
  ): true {
    this.$$nextProps[key] = value;
    return true;
  }

  $props<Props extends EnabledProps<CS>>(props: Props): true {
    Object.assign(this.$$nextProps, props);
    return true;
  }

  /**
   * The properties that will be set to the next component.
   */
  protected $$nextProps: Record<string | number | symbol, any> = {};

  $cls(...args: any[]): true {
    this.$$nextCls +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + " ";
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

  $css(...args: any[]): true {
    this.$$nextCss +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + ";";
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

    let textNode = this.$state.currentRefTreeNode[ckey] as
      | DOMNodeComponent
      | undefined;
    if (!textNode) {
      textNode = new TextNodeComponent(document.createTextNode(text));
      this.$state.currentRefTreeNode[ckey] = textNode;
    } else if (textNode.node.textContent !== text) {
      textNode.node.textContent = text;
    }

    this.$$fulfillRef(textNode);

    this.$state.currentDOMParent.pendingChildren.push(textNode);
  }

  $$processComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    args: any[],
  ): T {
    let component = this.$state.currentRefTreeNode[ckey] as T | undefined;
    if (!component) {
      component = new ctor(this.$app);
      this.$state.currentRefTreeNode[ckey] = component;
    }

    this.$$fulfillRef(component);

    // Store the pending main element owners for this component and clear it.
    const pendingMainElOwners = this.$state.pendingMainElOwner;
    this.$state.pendingMainElOwner = [];

    // Store the classes and styles for this component and clear them.
    const css = this.$$consumeCss();
    const cls = this.$$consumeCls();

    component.$mainEl = undefined as DOMElementComponent | undefined;
    this.$state.pendingMainElOwner.push(component);

    component.$props = this.$$nextProps;
    this.$$nextProps = {};

    const parentRefTreeNode = this.$state.currentRefTreeNode;
    this.$state.currentRefTreeNode = component.$refTreeNode;

    try {
      component.main(this._, ...args);
      if (import.meta.env.DEV) {
        this.$$assertEmpty();
      }
    } catch (e) {
      this.$app.callHook("onError", e);
    }

    this.$state.currentRefTreeNode = parentRefTreeNode;

    if (component.$mainEl) {
      // There is a $mainEl in the component.
      for (const owner of pendingMainElOwners) {
        // If the owner has a main element, it must be set by calling `this.$main()`.
        // So we don't need to set it to the default value.
        owner.$mainEl ??= component.$mainEl;
      }
      // All the pending main element owners are fulfilled.
      this.$state.pendingMainElOwner = [];

      // Add the classes and styles to the main element.
      component.$mainEl.addCls(cls);
      component.$mainEl.addCss(css);
    } else {
      // Not append arrays to ignore pending main element owners in the inner scope.
      // Pass the pending main element owners for this component to the next component.
      this.$state.pendingMainElOwner = pendingMainElOwners;
    }

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
    const refTreeNode = appState.currentRefTreeNode;
    parent.pendingChildren.push(el);

    if (content !== undefined) {
      // Set the current DOM parent to this DOM element component.
      appState.currentDOMParent = el;
      appState.currentRefTreeNode = el.$refTreeNode;

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
      appState.currentRefTreeNode = refTreeNode;
    }
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
    let el = this.$state.currentRefTreeNode[ckey] as
      | DOMElementComponent
      | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof HTMLElementTagNameMap>(
        document.createElement(tagName),
      );
      this.$state.currentRefTreeNode[ckey] = el;
    }

    this.$$fulfillRef(el);
    this.$$fulfillMainEl(el);

    this.$$updateDOMContent(this.$state, el, inner);

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
    let el = this.$state.currentRefTreeNode[ckey] as
      | DOMElementComponent
      | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof SVGElementTagNameMap>(
        document.createElementNS("http://www.w3.org/2000/svg", tagName),
      );
      this.$state.currentRefTreeNode[ckey] = el;
    }

    this.$$fulfillRef(el);
    this.$$fulfillMainEl(el);

    this.$$updateDOMContent(this.$state, el, inner);

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
  }
}

/**
 * The full context type in `UPDATE` state, with context funcs.
 */
export type UpdateContext<CS extends ContextState = InitialContextState> =
  IntrinsicUpdateContext<CS> & ContextFuncs<CS>;
