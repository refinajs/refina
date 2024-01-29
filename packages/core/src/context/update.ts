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
  TextNodeComponent,
} from "../dom";
import {
  PatchTarget,
  SelectorNode,
  createPatchTarget,
  parseSelector,
} from "../patch";
import {
  ContextFuncs,
  IntrinsicBaseContext,
  RealContextFuncs,
  _,
  initializeBaseContext,
} from "./base";

interface NextData {
  props: Record<any, any>;
  attrs: Record<any, any>;
  cls: string;
  css: string;
  eventListeners: DOMElementEventListenersInfoRaw[];
}

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
   * Fulfill the pending primary element owners with the given primary element,
   *  and clear the pending primary element owners list.
   *
   * @param primaryEl The primary element to fulfill.
   */
  $$fulfillPrimaryEl(primaryEl: DOMElementComponent): void;

  /**
   * The `Ref` object of the next component.
   */
  $$nextRef: Ref<unknown> | null;

  /**
   * Fulfill `nextRef` with the given value,
   *  and clear `nextRef`.
   *
   * @param current The value to fulfill.
   */
  $$fulfillRef(current: unknown): void;

  $$pendingPatches: SelectorNode[];

  $$fulfillPatches(name: string): PatchTarget[];

  /**
   * The data of the next element or component.
   */
  $$nextData: NextData;

  /**
   * Get the data of the next element or component,
   *  and clear the data.
   */
  $$consumeNextData(patches: PatchTarget[]): NextData;

  /**
   * Process the content of a DOM element component in `UPDATE` state.
   *
   * @param el The DOM element component.
   * @param content The content of the DOM element component.
   */
  $$updateDOMContent(el: DOMElementComponent, content?: Content): void;
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

  context.$$pendingPatches = [];

  context.$$nextRef = null;

  context.$$nextData = {
    props: {},
    attrs: {},
    cls: "",
    css: "",
    eventListeners: [],
  };

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
    Object.assign(context.$$nextData.props, props);
    return true;
  };

  context.$cls = (...args: unknown[]) => {
    context.$$nextData.cls +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + " ";
    return true;
  };

  context.$css = (...args: unknown[]) => {
    context.$$nextData.css +=
      (Array.isArray(args[0])
        ? String.raw({ raw: args[0] }, ...args.slice(1))
        : args[0]) + ";";
    return true;
  };

  context.$id = (...args: unknown[]) => {
    context.$$nextData.attrs.id = Array.isArray(args[0])
      ? String.raw({ raw: args[0] }, ...args.slice(1))
      : args[0];
    return true;
  };

  context.$attrs = attrs => {
    Object.assign(context.$$nextData.attrs, attrs);
    return true;
  };

  context.$patch = (...args) => {
    const selector = Array.isArray(args[0])
      ? String.raw({ raw: args[0] }, ...args.slice(1))
      : (args[0] as string);
    const patchTarget = createPatchTarget();
    context.$$pendingPatches.push(parseSelector(selector, patchTarget));
    return patchTarget;
  };

  context.$$fulfillPatches = name => {
    const patches = context.$$pendingPatches.map(patch => patch(name));
    context.$$pendingPatches = patches.filter(
      patch => typeof patch === "function",
    ) as SelectorNode[];
    return patches.filter(patch => typeof patch === "object") as PatchTarget[];
  };

  context.$$consumeNextData = patches => {
    const data = {
      props: context.$$nextData.props,
      attrs: context.$$nextData.attrs,
      cls: context.$$nextData.cls,
      css: context.$$nextData.css,
      eventListeners: context.$$nextData.eventListeners,
    };
    for (let i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i].patchData;
      Object.assign(data.props, patch.props);
      Object.assign(data.attrs, patch.attrs);
      if (patch.resetCls) {
        data.cls = patch.cls;
      } else {
        data.cls += " " + patch.cls;
      }
      if (patch.resetCss) {
        data.css = patch.css;
      } else {
        data.css += " " + patch.css;
      }
      if (Object.keys(patch.eventListeners).length > 0) {
        data.eventListeners.push(patch.eventListeners);
      }
    }
    context.$$nextData = {
      props: {},
      attrs: {},
      cls: "",
      css: "",
      eventListeners: [],
    };
    return data;
  };

  if (import.meta.env.DEV) {
    context.$$assertEmpty = () => {
      if (context.$$nextRef) {
        console.warn("Ref", context.$$nextRef, "is not fulfilled.");
        context.$$nextRef = null;
      }
      const { props, attrs, cls, css, eventListeners } = context.$$nextData;
      if (Object.keys(props).length > 0) {
        console.warn("Props", props, "is not fulfilled.");
      }
      if (Object.keys(attrs).length > 0) {
        console.warn("Attrs", attrs, "is not fulfilled.");
      }
      if (cls.length > 0) {
        console.warn("Classes", cls, "is not fulfilled.");
      }
      if (css.length > 0) {
        console.warn("Styles", css, "is not fulfilled.");
      }
      if (eventListeners.length > 0) {
        console.warn("Event listeners", eventListeners, "is not fulfilled.");
      }
      context.$$nextData = {
        props: {},
        attrs: {},
        cls: "",
        css: "",
        eventListeners: [],
      };
    };
  }

  context.$$c = (ckey, funcName, ...args) => {
    if (funcName[0] === "_") {
      // The context function is for a HTML or SVG element.
      const [attrsArg, children, eventListenersArg] = args as [
        attrs?: Record<string, unknown>,
        children?: Content,
        eventListeners?: DOMElementEventListenersInfoRaw,
      ];

      let el = context.$$currentRefNode[ckey] as
        | DOMElementComponent
        | undefined;
      if (!el) {
        if (/^_svg[A-Z]/.test(funcName)) {
          // The context function is for a SVG element.
          const tagName = (funcName[4].toLowerCase() +
            funcName.slice(5)) as keyof SVGElementTagNameMap;
          // Create a new element if not exist.
          el = new SVGElementComponent<keyof SVGElementTagNameMap>(
            document.createElementNS("http://www.w3.org/2000/svg", tagName),
          );
          context.$$currentRefNode[ckey] = el;
        } else {
          // The context function is for a HTML element.
          const rawTagName = funcName.slice(1);
          const tagName = (context.$app.htmlElementAlias[rawTagName] ??
            rawTagName) as keyof HTMLElementTagNameMap;
          // Create a new element if not exist.
          el = new HTMLElementComponent<keyof HTMLElementTagNameMap>(
            document.createElement(tagName),
          );
          context.$$currentRefNode[ckey] = el;
        }
      }

      const patches = context.$$pendingPatches;
      const thisPatches = context.$$fulfillPatches(funcName);
      const { props, attrs, cls, css, eventListeners } =
        context.$$consumeNextData(thisPatches);

      if (import.meta.env.DEV) {
        if (Object.keys(props).length > 0) {
          console.warn(`Props ${Object.keys(props)} is not fulfilled.`);
        }
      }

      context.$$fulfillRef(el);
      context.$$fulfillPrimaryEl(el);

      context.$$updateDOMContent(el, children);

      el.addAttrs({ ...attrsArg, ...attrs });
      el.addCls(cls);
      el.addCss(css);
      eventListenersArg && el.addEventListeners(eventListenersArg);
      eventListeners.forEach(e => el!.addEventListeners(e));

      context.$$pendingPatches = patches;

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

    if (import.meta.env.DEV) {
      context.$$assertEmpty();
    }

    context.$$currentDOMParent.pendingChildren.push(textNode);
  };

  context.$$processComponent = <T extends Component>(
    ckey: string,
    ctor: new () => T,
    args: unknown[],
    name: string,
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

    const patches = context.$$pendingPatches;
    const thisPatches = context.$$fulfillPatches(name);
    const { props, attrs, cls, css, eventListeners } =
      context.$$consumeNextData(thisPatches);

    Object.assign(component, props);

    component.$primaryEl = undefined as DOMElementComponent | undefined;
    context.$$pendingPrimaryElOwner.push(component);

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

    if (component.$primaryEl) {
      // There is a $primaryEl in the component.
      for (const owner of pendingPrimaryElOwners) {
        // If the owner has a primary element, it must be set by calling `context.$main()`.
        // So we don't need to set it to the default value.
        owner.$primaryEl ??= component.$primaryEl;
      }
      // All the pending primary element owners are fulfilled.
      context.$$pendingPrimaryElOwner = [];

      // Add attrs, classes and styles to the primary element.
      const el = component.$primaryEl;
      el.addAttrs(attrs);
      el.addCls(cls);
      el.addCss(css);
      eventListeners.forEach(e => el.addEventListeners(e));
    } else {
      // Not append arrays to ignore pending primary element owners in the children scope.
      // Pass the pending primary element owners for context component to the next component.
      context.$$pendingPrimaryElOwner = pendingPrimaryElOwners;
    }

    context.$$currentRefNode = parentRefNode;
    context.$$pendingPatches = patches;

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

  app.callHook("initContext", context);
}
