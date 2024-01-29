import { App } from "../app";
import { Component } from "../component";
import { Ref, mergeRefs } from "../data";
import {
  Content,
  DOMElementComponent,
  DOMElementEventListenersInfoRaw,
  DOMNodeComponent,
  HTMLElementComponent,
  SVGElementComponent,
  SVGElementFuncData as SVGElementFuncAttrs,
  TextNodeComponent,
} from "../dom";
import {
  ContextFuncs,
  IntrinsicBaseContext,
  RealContextFuncs,
  _,
  initializeBaseContext,
} from "./base";

export interface IntrinsicUpdateContext extends IntrinsicBaseContext {
  $lowlevel: IntrinsicUpdateContext;

  /**
   * The current parent DOM element.
   */
  $$currentDOMParent: DOMElementComponent;

  /**
   * Components waiting for a `$primaryEl`.
   *
   * If the value is `true`, the component is waiting for the first DOM element to be its default `$primaryEl`.
   */
  $$pendingPrimaryElOwner: (DOMElementComponent | Component)[];

  /**
   * The `Ref` object of the next component.
   */
  $$nextRef: Ref<unknown> | null;

  /**
   * The properties that will be set to the next component.
   */
  $$nextProps: Record<string | number | symbol, unknown>;

  /**
   * The classes that will be added to the next component.
   */
  $$nextCls: string;

  /**
   * The styles that will be added to the next component.
   */
  $$nextCss: string;

  /**
   * The attributes that will be added to the next element.
   */
  $$nextAttrs: Record<string, unknown>;

  /**
   * Fulfill `nextRef` with the given value,
   *  and clear `nextRef`.
   *
   * @param current The value to fulfill.
   */
  $$fulfillRef(current: unknown): void;

  /**
   * Fulfill the pending primary element owners with the given primary element,
   *  and clear the pending primary element owners list.
   *
   * @param primaryEl The primary element to fulfill.
   */
  $$fulfillPrimaryEl(primaryEl: DOMElementComponent): void;

  /**
   * Get the classes that will be added to the next component,
   *  and clear `nextCls`.
   *
   * @returns The classes.
   */
  $$consumeCls(): string;

  /**
   * Get the styles that will be added to the next component,
   *  and clear `nextCss`.
   *
   * @returns The styles.
   */
  $$consumeCss(): string;

  /**
   * Get the attrs that will be added to the next component,
   *  and clear `nextAttrs`.
   *
   * @returns The attrs.
   */
  $$consumeAttrs(): Record<string, unknown>;

  /**
   * Process the content of a DOM element component in `UPDATE` state.
   *
   * @param el The DOM element component.
   * @param content The content of the DOM element component.
   */
  $$updateDOMContent(el: DOMElementComponent, content?: Content): void;

  /**
   * Process a HTML element.
   *
   * @param ckey The Ckey of the element.
   * @param tagName The tag name of the element.
   * @param cls The classes of the element.
   * @param css The styles of the element.
   * @param attrs The attrs of the element.
   * @param children Children of the element.
   * @param eventListeners The event listeners of the element.
   */
  $$processHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    attrs?: Partial<HTMLElementTagNameMap[E]>,
    children?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ): void;

  /**
   * Process a SVG element.
   *
   * @param ckey The Ckey of the element.
   * @param tagName The tag name of the element.
   * @param cls The classes of the element.
   * @param css The styles of the element.
   * @param attrs The attrs of the element.
   * @param children Children of the element.
   * @param eventListeners The event listeners of the element.
   */
  $$processSVGElement<E extends keyof SVGElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    attrs?: SVGElementFuncAttrs,
    children?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ): void;
}

/**
 * The full context type in `UPDATE` state, with context funcs.
 */
export type UpdateContext = Readonly<
  Omit<IntrinsicUpdateContext, `$$${string}`>
> &
  ContextFuncs;

/**
 * Intialize the context in `UPDATE` state.
 *
 * @param app The app instance.
 */
export function initializeUpdateContext(app: App) {
  initializeBaseContext(app);

  const context = _ as unknown as IntrinsicUpdateContext;

  context.$updateContext = context as unknown as UpdateContext;

  context.$recvContext = null;

  context.$$pendingPrimaryElOwner = [];

  context.$$currentDOMParent = app.root;

  context.$$nextRef = null;

  context.$$nextProps = {};

  context.$$nextCls = "";

  context.$$nextCss = "";

  context.$$nextAttrs = {};

  context.$ref = (ref, ...refs) => {
    context.$$nextRef = refs.length === 0 ? ref : mergeRefs(ref, ...refs);
    return true;
  };

  context.$$fulfillRef = current => {
    if (context.$$nextRef !== null) {
      context.$$nextRef.current = current;
      context.$$nextRef = null;
    }
  };

  context.$$fulfillPrimaryEl = primaryEl => {
    for (const owner of context.$$pendingPrimaryElOwner) {
      owner.$primaryEl = primaryEl;
    }
    context.$$pendingPrimaryElOwner = [];
  };

  context.$props = props => {
    Object.assign(context.$$nextProps, props);
    return true;
  };

  context.$cls = (...args: unknown[]) => {
    context.$$nextCls +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + " ";
    return true;
  };

  context.$$consumeCls = () => {
    const cls = context.$$nextCls;
    context.$$nextCls = "";
    return cls;
  };

  context.$css = (...args: unknown[]) => {
    context.$$nextCss +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + ";";
    return true;
  };

  context.$$consumeCss = () => {
    const css = context.$$nextCss;
    context.$$nextCss = "";
    return css;
  };

  context.$id = (...args: unknown[]) => {
    context.$$nextAttrs.id = Array.isArray(args[0])
      ? String.raw({ raw: args[0] }, ...args.slice(1))
      : args[0];
    return true;
  };

  context.$attrs = attrs => {
    Object.assign(context.$$nextAttrs, attrs);
    return true;
  };

  context.$$consumeAttrs = () => {
    const attrs = context.$$nextAttrs;
    context.$$nextAttrs = {};
    return attrs;
  };

  context.$$assertEmpty = () => {
    if (context.$$nextRef) {
      console.warn("Ref", context.$$nextRef, "is not fulfilled.");
      context.$$nextRef = null;
    }
    if (Object.keys(context.$$nextProps).length > 0) {
      console.warn("Props", context.$$nextProps, "is not fulfilled.");
      context.$$nextProps = {};
    }
    if (context.$$nextCls.length > 0) {
      console.warn("Classes", context.$$nextCls, "is not fulfilled.");
      context.$$nextCls = "";
    }
    if (context.$$nextCss.length > 0) {
      console.warn("Styles", context.$$nextCss, "is not fulfilled.");
      context.$$nextCss = "";
    }
  };

  context.$$c = (ckey, funcName, ...args) => {
    if (funcName[0] === "_") {
      // The context function is for a HTML or SVG element.
      const [attrsArg, children, eventListeners] = args;

      const attrs = { ...(attrsArg as object), ...context.$$consumeAttrs() };

      if (/^_svg[A-Z]/.test(funcName)) {
        // The context function is for a SVG element.
        const tagName = (funcName[4].toLowerCase() +
          funcName.slice(5)) as keyof SVGElementTagNameMap;
        context.$$processSVGElement(
          ckey,
          tagName,
          context.$$consumeCls(),
          context.$$consumeCss(),
          attrs as SVGElementFuncAttrs | undefined,
          children as Content | undefined,
          eventListeners as
            | DOMElementEventListenersInfoRaw<keyof SVGElementTagNameMap>
            | undefined,
        );
      } else {
        // The context function is for a HTML element.
        const rawTagName = funcName.slice(1);
        const tagName = (context.$app.htmlElementAlias[rawTagName] ??
          rawTagName) as keyof HTMLElementTagNameMap;
        context.$$processHTMLElement(
          ckey,
          tagName,
          context.$$consumeCls(),
          context.$$consumeCss(),
          attrs as
            | Partial<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>
            | undefined,
          children as Content | undefined,
          eventListeners as
            | DOMElementEventListenersInfoRaw<keyof HTMLElementTagNameMap>
            | undefined,
        );
      }
      // HTML and SVG element functions do not have a return value.
      return;
    }
    // The context function is for a user-defined component.
    const func = context.$app.contextFuncs[funcName as keyof RealContextFuncs];
    if (import.meta.env.DEV) {
      if (!func) {
        throw new Error(`Unknown element ${funcName}.`);
      }
    }
    // Return the return value of the context function.
    return func.call(context.$lowlevel, ckey, ...args);
  };

  context.$$t = (ckey, content) => {
    if (import.meta.env.DEV) {
      if (context.$$consumeCls().length > 0) {
        console.warn(`Text node cannot have classes`);
      }
      if (context.$$consumeCss().length > 0) {
        console.warn(`Text node cannot have style`);
      }
    }

    const text = String(content);

    let textNode = context.$$currentRefNode[ckey] as
      | DOMNodeComponent
      | undefined;
    if (!textNode) {
      textNode = new TextNodeComponent(document.createTextNode(text));
      context.$$currentRefNode[ckey] = textNode;
    } else if (textNode.node.textContent !== text) {
      textNode.node.textContent = text;
    }

    context.$$fulfillRef(textNode);

    context.$$currentDOMParent.pendingChildren.push(textNode);
  };

  context.$$processComponent = <T extends Component>(
    ckey: string,
    ctor: new () => T,
    args: unknown[],
  ) => {
    let component = context.$$currentRefNode[ckey] as T | undefined;

    const parentRefNode = context.$$currentRefNode;

    if (!component) {
      component = new ctor();
      parentRefNode[ckey] = component;
    }

    context.$$fulfillRef(component);

    // Store the pending primary element owners for context component and clear it.
    const pendingPrimaryElOwners = context.$$pendingPrimaryElOwner;
    context.$$pendingPrimaryElOwner = [];

    // Store the classes and styles for context component and clear them.
    const css = context.$$consumeCss();
    const cls = context.$$consumeCls();

    component.$primaryEl = undefined as DOMElementComponent | undefined;
    context.$$pendingPrimaryElOwner.push(component);

    Object.assign(component, context.$$nextProps);
    context.$$nextProps = {};

    context.$$currentRefNode = component.$refTreeNode;

    let ret: unknown;

    try {
      ret = component.$main(...args);
      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }
    } catch (e) {
      context.$app.callHook("onError", e);
    }

    context.$$currentRefNode = parentRefNode;

    if (component.$primaryEl) {
      // There is a $primaryEl in the component.
      for (const owner of pendingPrimaryElOwners) {
        // If the owner has a primary element, it must be set by calling `context.$main()`.
        // So we don't need to set it to the default value.
        owner.$primaryEl ??= component.$primaryEl;
      }
      // All the pending primary element owners are fulfilled.
      context.$$pendingPrimaryElOwner = [];

      // Add the classes and styles to the primary element.
      component.$primaryEl.addCls(cls);
      component.$primaryEl.addCss(css);
    } else {
      // Not append arrays to ignore pending primary element owners in the children scope.
      // Pass the pending primary element owners for context component to the next component.
      context.$$pendingPrimaryElOwner = pendingPrimaryElOwners;
    }

    return ret;
  };

  context.$$updateDOMContent = (el, content) => {
    const parent = context.$$currentDOMParent;
    const refTreeNode = context.$$currentRefNode;
    parent.pendingChildren.push(el);

    if (content !== undefined) {
      // Set the current DOM parent to context DOM element component.
      context.$$currentDOMParent = el;
      context.$$currentRefNode = el.$refTreeNode;

      if (typeof content === "function") {
        // The content is a view function.

        try {
          content(context._);
          if (import.meta.env.DEV) {
            context.$$assertEmpty();
          }
        } catch (e) {
          context.$app.callHook("onError", e);
        }
      } else {
        // The content is a text node.
        context.$$t("_t", content);
      }

      // Restore the DOM parent.
      context.$$currentDOMParent = parent;
      context.$$currentRefNode = refTreeNode;
    }
  };

  context.$$processHTMLElement = (
    ckey,
    tagName,
    cls,
    css,
    attrs = {},
    children,
    eventListeners = {},
  ) => {
    let el = context.$$currentRefNode[ckey] as DOMElementComponent | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new HTMLElementComponent<keyof HTMLElementTagNameMap>(
        document.createElement(tagName),
      );
      context.$$currentRefNode[ckey] = el;
    }

    context.$$fulfillRef(el);
    context.$$fulfillPrimaryEl(el);

    context.$$updateDOMContent(el, children);

    el.addAttrs(attrs);
    el.addCls(cls);
    el.addCss(css);
    el.addEventListeners(eventListeners);
  };

  context.$$processSVGElement = (
    ckey,
    tagName,
    cls,
    css,
    attrs = {},
    children,
    eventListeners = {},
  ) => {
    let el = context.$$currentRefNode[ckey] as DOMElementComponent | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new SVGElementComponent<keyof SVGElementTagNameMap>(
        document.createElementNS("http://www.w3.org/2000/svg", tagName),
      );
      context.$$currentRefNode[ckey] = el;
    }

    context.$$fulfillRef(el);
    context.$$fulfillPrimaryEl(el);

    context.$$updateDOMContent(el, children);

    el.addAttrs(attrs);
    el.addCls(cls);
    el.addCss(css);
    el.addEventListeners(eventListeners);
  };

  app.callHook("initContext", context);
}
