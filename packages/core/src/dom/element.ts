import { RefTreeNode } from "../app";
import { Content } from "./content";
import { DOMNodeComponent, MaybeChildNode } from "./node";

/**
 * Element type of DOM element components.
 */
export type DOMElement = HTMLElement | SVGElement;

/**
 * The merged map from tag name to `DOMElement`.
 */
export type DOMElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;

/**
 * Get the DOM element type from tag name.
 */
export type TagNameToDOMElement<E extends keyof DOMElementTagNameMap> =
  E extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[E]
    : E extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[E]
    : never;

/**
 * Get the evnet listener map type from tag name.
 */
export type TagNameToEventMap<E extends keyof DOMElementTagNameMap> =
  E extends keyof HTMLElementEventMap
    ? HTMLElementEventMap[E]
    : E extends keyof SVGElementEventMap
    ? SVGElementEventMap[E]
    : never;

/**
 * The map of custom event listeners of web components.
 *
 * Add your custom event listeners to this map using declaration merging:
 *
 * ```ts
 * declare module "refina" {
 *   interface WebComponentsEventListeners {
 *     "web-component-tag-name": {
 *        "custom-event-name": (this: CustomElement, ev: CustomEvent) => void;
 *     };
 *   }
 * }
 * ```
 */
export interface WebComponentsEventListeners {}

/**
 * The map of native event listeners of DOM elements.
 */
type NativeElementEventListeners<E> = {
  // HTMLElementEventMap is the same as SVGElementEventMap.
  [K in keyof HTMLElementEventMap]: (
    this: E,
    ev: HTMLElementEventMap[K],
  ) => void;
};

/**
 * Check if the tag name is a native element.
 *
 * If and only if there is no hyphen in the tag name, it is considered as a native element.
 *
 * **Warning**: This type is not that accurate.
 */
type IsNativeElement<E extends keyof DOMElementTagNameMap> =
  E extends `${string}-${string}` ? false : true;

/**
 * Get the event listeners type by the tag name.
 */
export type DOMElementEventListeners<E extends keyof DOMElementTagNameMap> =
  IsNativeElement<E> extends true
    ? NativeElementEventListeners<TagNameToDOMElement<E>>
    : E extends keyof WebComponentsEventListeners
    ? WebComponentsEventListeners[E] &
        NativeElementEventListeners<HTMLElementTagNameMap[E]>
    : {};

/**
 * The event listeners info type of a DOM element.
 */
export type DOMElementEventListenersInfoRaw<
  E extends keyof DOMElementTagNameMap,
> = {
  [K in keyof DOMElementEventListeners<E>]?:
    | DOMElementEventListeners<E>[K]
    | {
        /**
         * i.e. the first argument of `addEventListener`.
         */
        listener: DOMElementEventListeners<E>[K];

        /**
         * i.e. the second argument of `addEventListener`.
         */
        options?: boolean | AddEventListenerOptions;
      };
};

type EventListenerParams = [
  listener: EventListener,
  options?: boolean | AddEventListenerOptions,
];

/**
 * The base class of DOM element components.
 *
 * The main function of this class is to manage the children of the DOM element.
 */
export abstract class DOMElementComponent<
  E extends keyof DOMElementTagNameMap = keyof DOMElementTagNameMap,
> extends DOMNodeComponent<TagNameToDOMElement<E>> {
  /**
   * The ref tree node of this element.
   */
  $refTreeNode: RefTreeNode = {};

  /**
   * The primary element of the component.
   *
   * In common cases, this is the same as `this`.
   */
  $primaryEl: DOMElementComponent = this;

  /**
   * Children DOM node components that are not updated to the DOM tree yet.
   */
  pendingChildren: DOMNodeComponent[] = [];

  /**
   * Children DOM node components that have mounted to the DOM tree.
   */
  protected mountedChildren = new Set<DOMNodeComponent>();

  updateDOM(): MaybeChildNode {
    this.applyAttrs();
    this.applyCls();
    this.applyCss();
    this.applyEventListeners();

    /** Child node components that mounted to the DOM tree but should be removed. */
    let childrenToRemove = new Set<DOMNodeComponent>(this.mountedChildren);
    /** Last updated child node. */
    let lastNode: MaybeChildNode = null;
    for (const child of this.pendingChildren) {
      // Update the child node.
      child.updateDOM();
      if (this.mountedChildren.has(child)) {
        // This child node is mounted.
        // Do not remove this child node.
        childrenToRemove.delete(child);
      } else {
        // This child node is not mounted yet.
        if (lastNode) {
          // There is a last updated child node.
          // Insert this child node after the last updated child node.
          child.insertAfter(lastNode);
        } else {
          // There is no last updated child node.
          // We should insert this child node as the first child node.
          child.prependTo(this.node);
        }
      }
      // Update the last updated child node.
      lastNode = child.asChildNode ?? lastNode;
    }

    // Remove mounted child nodes that are no longer used.
    for (const child of childrenToRemove) {
      child.removeFrom(this.node);
    }

    this.mountedChildren = new Set(this.pendingChildren);

    // Reset the pending children for the next `UPDATE` call.
    this.pendingChildren = [];

    return lastNode;
  }

  /**
   * The attributes that are not applied yet.
   *
   * It can accumulate attributes from multiple calls of `addAttr` during the `UPDATE` call.
   */
  protected pendingAttrs: Partial<this["node"]> = {};

  /**
   * Add a attributes to the element.
   *
   * @param attrs The attributes to add.
   */
  addAttrs(attrs: Partial<this["node"]>) {
    Object.assign(this.pendingAttrs, attrs);
  }

  /**
   * The attributes that are applied to the DOM element.
   */
  protected appliedAttrs: Partial<this["node"]> = {};

  /**
   * Write the pending attributes to the DOM element.
   */
  protected applyAttrs(): void {
    throw new Error("Not implemented.");
  }

  /**
   * The classes that are not applied yet.
   *
   * It can accumulate classes from multiple calls of `addCls` during the `UPDATE` call.
   */
  protected pendingCls = "";

  /**
   * Append classes to the element.
   *
   * @param cls The classes to add.
   */
  addCls(cls: string) {
    this.pendingCls += cls;
  }

  /**
   * The classes that are applied to the DOM element.
   */
  protected appliedCls = "";

  /**
   * Write the pending classes to the DOM element.
   */
  protected applyCls() {
    if (this.appliedCls !== this.pendingCls) {
      if (this.pendingCls === "") {
        // Remove the attribute, otherwise "class" attribute will be still visible in the DevTools.
        this.node.removeAttribute("class");
      } else {
        this.node.setAttribute("class", this.pendingCls);
      }
      this.appliedCls = this.pendingCls;
    }

    // Reset the pending classes for the next `UPDATE` call.
    this.pendingCls = "";
  }

  /**
   * The styles that are not applied yet.
   *
   * It can accumulate styles from multiple calls of `addCss` during the `UPDATE` call.
   */
  protected pendingCss = "";

  /**
   * Append styles to the element.
   *
   * **Note**: It is not required to add a semicolon (`;`) at the end of the style.
   *
   * @param css The css to add.
   */
  addCss(css: string) {
    if (css === "") return;
    this.pendingCss += css;
  }

  /**
   * The styles that are applied to the DOM element.
   */
  protected appliedCss = "";

  /**
   * Write the pending styles to the DOM element.
   */
  protected applyCss() {
    if (this.appliedCss !== this.pendingCss) {
      if (this.pendingCss === "") {
        // Remove the attribute, otherwise "style" attribute will be still visible in the DevTools.
        this.node.removeAttribute("style");
      } else {
        this.node.setAttribute("style", this.pendingCss);
      }
      this.appliedCss = this.pendingCss;
    }

    // Reset the pending styles for the next `UPDATE` call.
    this.pendingCss = "";
  }

  /**
   * The event listeners that are not applied yet.
   *
   * It can accumulate event listeners from multiple calls of `addEventListener` during the `UPDATE` call.
   */
  pendingEventListeners: Record<string, EventListenerParams[]> = {};

  /**
   * The event listeners that are applied to the DOM element.
   */
  registeredEventListeners: Record<string, EventListenerParams[]> = {};

  /**
   * Add an event listener to the element.
   *
   * **Note**: The parameters of this method is the same as `addEventListener` of `HTMLElement`.
   *
   * @param type The event type.
   * @param listener The event listener.
   * @param options The event listener options.
   */
  addEventListener<K extends keyof DOMElementEventListeners<E>>(
    type: K & string,
    listener: IsNativeElement<E> extends true
      ? (this: HTMLAnchorElement, ev: TagNameToEventMap<E>) => void
      : DOMElementEventListeners<E>[K],
    options?: boolean | AddEventListenerOptions,
  ) {
    // Initialize the pending event listeners.
    this.pendingEventListeners[type] ??= [];

    this.pendingEventListeners[type].push([listener as EventListener, options]);
  }

  /**
   * This method is used by `Context` to add the event listeners
   *  from the third argument of the DOM element component function.
   *
   * @param listeners The event listener map to add.
   */
  addEventListeners(listeners: DOMElementEventListenersInfoRaw<E>): void {
    for (const type in listeners) {
      const listener = listeners[type] as
        | EventListener
        | {
            listener: DOMElementEventListeners<E>[any];
            options?: boolean | AddEventListenerOptions;
          };

      // Initialize the pending event listeners.
      this.pendingEventListeners[type] ??= [];

      // Normalize the listener to the form of [listener, options]
      if (typeof listener === "function") {
        this.pendingEventListeners[type].push([listener]);
      } else {
        this.pendingEventListeners[type].push([
          listener.listener,
          listener.options,
        ]);
      }
    }
  }

  /**
   * Write the pending event listeners to the DOM element.
   */
  applyEventListeners() {
    const toRemove = this.registeredEventListeners;
    const toAdd = this.pendingEventListeners;

    for (const event in toRemove) {
      for (const listener of toRemove[event]) {
        this.node.removeEventListener(event, ...listener);
      }
    }

    for (const event in toAdd) {
      for (const listener of toAdd[event]) {
        this.node.addEventListener(event, ...listener);
      }
    }

    this.registeredEventListeners = toAdd;

    // Reset the pending event listeners for the next `UPDATE` call.
    this.pendingEventListeners = {};
  }
}

export class HTMLElementComponent<
  E extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> extends DOMElementComponent<E> {
  protected applyAttrs(): void {
    for (const key in this.pendingAttrs) {
      const newValue = this.pendingAttrs[key];
      if (this.appliedAttrs[key] === newValue) continue;
      if (newValue === undefined) {
        // Delete the property if the value is undefined.
        delete this.node[key];
      } else {
        // For a HTML element, just assign the value to the property.
        this.node[key] = newValue;
      }
    }
    this.appliedAttrs = this.pendingAttrs;
    this.pendingAttrs = {};
  }
}

export class SVGElementComponent<
  E extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap,
> extends DOMElementComponent<E> {
  protected applyAttrs(): void {
    for (const key in this.pendingAttrs) {
      const newValue = this.pendingAttrs[key];
      if (this.appliedAttrs[key] === newValue) continue;
      if (newValue === undefined) {
        this.node.removeAttribute(key);
      } else if (typeof newValue === "function") {
        // Cannot stringify a function, so just assign it.
        this.node[key] = newValue as any;
      } else {
        // For SVG elements, all attributes are string,
        //  and just assign it to the SVGElement does not work.
        this.node.setAttribute(key, String(newValue));
      }
    }
    this.appliedAttrs = this.pendingAttrs;
    this.pendingAttrs = {};
  }
}

/**
 * Replace all hyphens with low lines.
 *
 * This is used to convert the tag name of custom elements to the function name.
 */
type ReplaceHyphenWithLowLine<S extends string> =
  S extends `${infer A}-${infer B}` ? `${A}_${ReplaceHyphenWithLowLine<B>}` : S;

/**
 * The component functions of HTML elements.
 */
export type HTMLElementFuncs = {
  /**
   * Render a HTML element or web component of this tag name.
   *
   * **Note**: Usually you don't need to use this function directly.
   *  A higher level function may be provided.
   *
   * **Note**: You can just pass event listeners to the `data` object,
   *  instead of passing them to the third argument,
   *  unless you need to specify the `options` of the event listeners.
   *
   * **Warning**: If an attribute is removed, still pass it to this function with `undefined` value.
   *
   * **Warning**: `UPDATE` call will not be triggered automatically
   *  in the event listeners in both `data` and `eventListeners`.
   *  You should call `app.update()` manually if you want to trigger an `UPDATE` call.
   *
   * @example
   * ```ts
   * _._button(
   *   {
   *     type: "button",
   *     onclick: () => {
   *       // ...
   *       app.update();
   *     }
   *   },
   *   "Click me!",
   *   {
   *     mouseover: {
   *       listener: () => {
   *         // ...
   *       },
   *       options: true,
   *     }
   *   }
   * );
   * ```
   * @param data An object that contains the attributes of the element.
   * @param inner The inner content of the element. It can be a string, a number, or a view function.
   * @param eventListeners The event listeners of the element.
   */
  [E in keyof HTMLElementTagNameMap as `_${ReplaceHyphenWithLowLine<E>}`]: (
    data?: Partial<HTMLElementTagNameMap[E]>,
    inner?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ) => void;
};

/**
 * Because type of attributes of SVG elements is not provided,
 *  this type is used to specify the attributes of SVG elements.
 */
export type SVGElementFuncData = Record<
  string,
  undefined | string | number | ((...args: any) => any)
>;

/**
 * The component functions of SVG elements.
 */
export type SVGElementFuncs = {
  /**
   * Render a SVG element of this tag name.
   *
   *
   * **Note**: Usually you don't need to use this function directly.
   *  A higher level function may be provided.
   *
   * **Note**: You can just pass event listeners to the `data` object,
   *  instead of passing them to the third argument,
   *  unless you need to specify the `options` of the event listeners.
   *
   * **Warning**: If an attribute is removed, still pass it to this function with `undefined` value.
   *
   * **Warning**: `UPDATE` call will not be triggered automatically
   *  in the event listeners in both `data` and `eventListeners`.
   *  You should call `app.update()` manually if you want to trigger an `UPDATE` call.
   *
   * @example
   * ```ts
   * _._svgLine(
   *   {
   *     x1: 0,
   *     y1: 0,
   *     x2: 100,
   *     y2: 100,
   *   }
   * );
   * ```
   * @param data An object that contains the attributes of the element.
   * @param inner The inner content of the element. It can be a string, a number, or a view function.
   * @param eventListeners The event listeners of the element.
   */
  [E in keyof SVGElementTagNameMap as `_svg${Capitalize<E>}`]: (
    data?: SVGElementFuncData,
    inner?: Content,
    eventListeners?: DOMElementEventListenersInfoRaw<E>,
  ) => void;
};

// Add HTML and SVG element functions to context.
declare module ".." {
  interface ContextFuncs extends HTMLElementFuncs {}
  interface ContextFuncs extends SVGElementFuncs {}
}
