import { App } from "../app";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentMainFunc,
} from "../component";
import { Ref, mergeRefs } from "../data";
import {
  Content,
  DOMElementComponent,
  DOMElementEventListenersInfoRaw,
  DOMNodeComponent,
  SVGElementFuncData,
  TextNodeComponent,
} from "../dom";
import {
  ContextFuncs,
  ContextState,
  InitialContextState,
  IntrinsicBaseContext,
  RealContextFuncs,
  initializeBaseContext,
} from "./base";

export interface IntrinsicUpdateContext<
  CS extends ContextState = InitialContextState,
> extends IntrinsicBaseContext<CS> {
  $lowlevel: IntrinsicUpdateContext;

  /**
   * The current parent DOM element.
   */
  $$currentDOMParent: DOMElementComponent;

  /**
   * Components waiting for a `$mainEl`.
   *
   * If the value is `true`, the component is waiting for the first DOM element to be its default `$mainEl`.
   */
  $$pendingMainElOwner: (DOMElementComponent | Component<any>)[];

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
   * Fulfill `nextRef` with the given value,
   *  and clear `nextRef`.
   *
   * @param current The value to fulfill.
   */
  $$fulfillRef(current: unknown): void;

  /**
   * Fulfill the pending main element owners with the given main element,
   *  and clear the pending main element owners list.
   *
   * @param mainEl The main element to fulfill.
   */
  $$fulfillMainEl(mainEl: DOMElementComponent): void;

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
   * @param data The data to assign to the element.
   * @param inner The inner content of the element.
   * @param eventListeners The event listeners of the element.
   */
  $$processHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ): void;

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
  $$processSVGElement<E extends keyof SVGElementTagNameMap>(
    ckey: string,
    tagName: E,
    cls: string,
    css: string,
    data?: SVGElementFuncData,
    inner?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ): void;
}

/**
 * The full context type in `UPDATE` state, with context funcs.
 */
export type UpdateContext<CS extends ContextState = InitialContextState> =
  Readonly<Omit<IntrinsicUpdateContext<CS>, `$$${string}`>> & ContextFuncs<CS>;

/**
 * Intialize the context in `UPDATE` state.
 * @param context The context to initialize.
 * @param app The app instance.
 */
export function initializeUpdateContext(
  context: IntrinsicUpdateContext,
  app: App,
) {
  initializeBaseContext(context, app);

  context.$updateContext = context as unknown as UpdateContext;

  context.$recvContext = null;

  context.$$pendingMainElOwner = [];

  context.$$currentDOMParent = app.root;

  context.$$nextRef = null;

  context.$$nextProps = {};

  context.$$nextCls = "";

  context.$$nextCss = "";

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

  context.$$fulfillMainEl = mainEl => {
    for (const owner of context.$$pendingMainElOwner) {
      owner.$mainEl = mainEl;
    }
    context.$$pendingMainElOwner = [];
  };

  context.$prop = (key, value) => {
    context.$$nextProps[key] = value;
    return true;
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
      const [data, inner, eventListeners] = args;

      if (
        funcName.startsWith("_svg") &&
        funcName[4].toUpperCase() === funcName[4]
      ) {
        // The context function is for a SVG element.
        const tagName = (funcName[4].toLowerCase() +
          funcName.slice(5)) as keyof SVGElementTagNameMap;
        context.$$processSVGElement(
          ckey,
          tagName,
          context.$$consumeCls(),
          context.$$consumeCss(),
          data as SVGElementFuncData | undefined,
          inner as Content | undefined,
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
          data as
            | Partial<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>
            | undefined,
          inner as Content | undefined,
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

    let textNode = context.$$currentRefTreeNode[ckey] as
      | DOMNodeComponent
      | undefined;
    if (!textNode) {
      textNode = new TextNodeComponent(document.createTextNode(text));
      context.$$currentRefTreeNode[ckey] = textNode;
    } else if (textNode.node.textContent !== text) {
      textNode.node.textContent = text;
    }

    context.$$fulfillRef(textNode);

    context.$$currentDOMParent.pendingChildren.push(textNode);
  };

  context.$$processComponent = <T extends Component<any>>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    factory: (this: T, context: ComponentContext<any>) => ComponentMainFunc,
    args: unknown[],
  ): T => {
    let component = context.$$currentRefTreeNode[ckey] as T | undefined;
    if (!component) {
      component = new ctor(context.$app);

      const componentContext = context._ as ComponentContext<any>;
      componentContext.$expose = exposed => {
        Object.assign(component!, exposed);
        return exposed;
      };

      component.$mainFunc = factory.call(component, componentContext);

      context.$$currentRefTreeNode[ckey] = component;
    }

    context.$$fulfillRef(component);

    // Store the pending main element owners for context component and clear it.
    const pendingMainElOwners = context.$$pendingMainElOwner;
    context.$$pendingMainElOwner = [];

    // Store the classes and styles for context component and clear them.
    const css = context.$$consumeCss();
    const cls = context.$$consumeCls();

    component.$mainEl = undefined as DOMElementComponent | undefined;
    context.$$pendingMainElOwner.push(component);

    component.$props = context.$$nextProps;
    context.$$nextProps = {};

    const parentRefTreeNode = context.$$currentRefTreeNode;
    context.$$currentRefTreeNode = component.$refTreeNode;

    try {
      component.$mainFunc(...args);
      if (import.meta.env.DEV) {
        context.$$assertEmpty();
      }
    } catch (e) {
      context.$app.callHook("onError", e);
    }

    context.$$currentRefTreeNode = parentRefTreeNode;

    if (component.$mainEl) {
      // There is a $mainEl in the component.
      for (const owner of pendingMainElOwners) {
        // If the owner has a main element, it must be set by calling `context.$main()`.
        // So we don't need to set it to the default value.
        owner.$mainEl ??= component.$mainEl;
      }
      // All the pending main element owners are fulfilled.
      context.$$pendingMainElOwner = [];

      // Add the classes and styles to the main element.
      component.$mainEl.addCls(cls);
      component.$mainEl.addCss(css);
    } else {
      // Not append arrays to ignore pending main element owners in the inner scope.
      // Pass the pending main element owners for context component to the next component.
      context.$$pendingMainElOwner = pendingMainElOwners;
    }

    return component;
  };

  context.$$updateDOMContent = (el, content) => {
    const parent = context.$$currentDOMParent;
    const refTreeNode = context.$$currentRefTreeNode;
    parent.pendingChildren.push(el);

    if (content !== undefined) {
      // Set the current DOM parent to context DOM element component.
      context.$$currentDOMParent = el;
      context.$$currentRefTreeNode = el.$refTreeNode;

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
      context.$$currentRefTreeNode = refTreeNode;
    }
  };

  context.$$processHTMLElement = (
    ckey,
    tagName,
    cls,
    css,
    data = {},
    inner,
    eventListeners = {},
  ) => {
    let el = context.$$currentRefTreeNode[ckey] as
      | DOMElementComponent
      | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof HTMLElementTagNameMap>(
        document.createElement(tagName),
      );
      context.$$currentRefTreeNode[ckey] = el;
    }

    context.$$fulfillRef(el);
    context.$$fulfillMainEl(el);

    context.$$updateDOMContent(el, inner);

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
  };

  context.$$processSVGElement = (
    ckey,
    tagName,
    cls,
    css,
    data = {},
    inner,
    eventListeners = {},
  ) => {
    let el = context.$$currentRefTreeNode[ckey] as
      | DOMElementComponent
      | undefined;
    if (!el) {
      // Create a new element if not exist.
      el = new DOMElementComponent<keyof SVGElementTagNameMap>(
        document.createElementNS("http://www.w3.org/2000/svg", tagName),
      );
      context.$$currentRefTreeNode[ckey] = el;
    }

    context.$$fulfillRef(el);
    context.$$fulfillMainEl(el);

    context.$$updateDOMContent(el, inner);

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
  };

  app.callHook("initContext", context);
}
