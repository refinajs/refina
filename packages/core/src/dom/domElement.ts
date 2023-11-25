import { ContextState } from "../context";
import { D } from "../data";
import {
  Content,
  DOMElementTagNameMap,
  DOMNodeComponent,
  DOMNodeComponentActionResult,
  MaybeChildNode,
} from "./base";

type DOMElementType<E extends keyof DOMElementTagNameMap> =
  E extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[E]
    : E extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[E]
    : never;

export interface WebComponentsEventListeners {}

export type NativeElementEventListeners<E> = {
  [K in keyof HTMLElementEventMap]: (
    this: E,
    ev: HTMLElementEventMap[K],
  ) => any;
};

type IsNativeElement<E extends keyof DOMElementTagNameMap> =
  E extends `${string}-${string}` ? false : true;

export type DOMElementEventListeners<E extends keyof DOMElementTagNameMap> =
  IsNativeElement<E> extends true
    ? NativeElementEventListeners<DOMElementType<E>>
    : E extends keyof WebComponentsEventListeners
    ? WebComponentsEventListeners[E]
    : {};

export type DOMElementEventListenerInfo<
  E extends keyof DOMElementTagNameMap,
  K extends keyof DOMElementEventListeners<E> = any,
> =
  | DOMElementEventListeners<E>[K]
  | {
      listener: DOMElementEventListeners<E>[K];
      options?: boolean | AddEventListenerOptions;
    };

export type DOMElementEventListenersInfo<E extends keyof DOMElementTagNameMap> =
  {
    [K in keyof DOMElementEventListeners<E>]?: DOMElementEventListenerInfo<
      E,
      K
    >;
  };

export class DOMElementComponent<
  E extends keyof DOMElementTagNameMap = keyof DOMElementTagNameMap,
> extends DOMNodeComponent<DOMElementType<E>> {
  get $mainEl() {
    return this.node as HTMLElement;
  }

  children: DOMNodeComponent[] = [];
  protected createdChildren = new Set<DOMNodeComponent>();

  updateDOMTree(): DOMNodeComponentActionResult {
    this.applyClasses();
    let createdUnused = new Set<DOMNodeComponent>(this.createdChildren);
    let lastEl: MaybeChildNode = null;
    for (const child of this.children) {
      if (this.createdChildren.has(child)) {
        lastEl = child.updateDOMTree().thisEl ?? lastEl;
        createdUnused.delete(child);
      } else {
        child.updateDOMTree();
        if (lastEl) {
          lastEl = child.insertAfter(lastEl) ?? lastEl;
        } else {
          if (this.node.firstChild) {
            lastEl = child.prependTo(this.node) ?? lastEl;
          } else {
            lastEl = child.appendTo(this.node) ?? lastEl;
          }
        }
      }
    }
    for (const unusedChild of createdUnused) {
      unusedChild.removeFrom(this.node);
    }
    this.createdChildren = new Set(this.children);
    return {
      lastEl,
      thisEl: this.node,
    };
  }

  protected currentClasses = "";
  addClasses(classes: string) {
    this.currentClasses += classes;
  }
  protected appliedClasses = "";
  protected applyClasses() {
    if (this.appliedClasses !== this.currentClasses) {
      if (this.currentClasses === "") {
        this.node.removeAttribute("class");
      } else {
        this.node.setAttribute("class", this.currentClasses);
      }
      this.appliedClasses = this.currentClasses;
    }
    this.currentClasses = "";
  }

  currentStyle: string = "";
  setStyle(style: string) {
    if (style !== this.currentStyle) {
      this.node.style.cssText = style;
      this.currentStyle = style;
    }
  }
  addStyle(style: string) {
    if (style.length > 0) {
      this.node.style.cssText += style;
      this.currentStyle += style;
    }
  }

  registeredEventListeners: Record<string, DOMElementEventListenerInfo<any>> =
    {};
  updateEventListeners(
    listeners: Record<string, DOMElementEventListenerInfo<any>>,
  ) {
    const listenersToRemove = this.registeredEventListeners;
    const newRegisteredEventListeners: Record<
      string,
      DOMElementEventListenerInfo<any>
    > = {};
    for (const event in listeners) {
      const listener = listeners[event] as any;
      if (listener) {
        if (listenersToRemove[event]) {
          listenersToRemove[event] = undefined;
          if (typeof listener === "function") {
            newRegisteredEventListeners[event] = listener;
          } else {
            newRegisteredEventListeners[event] = { ...listener };
          }
        } else {
          if (typeof listener === "function") {
            this.node.addEventListener(event, listener);
            newRegisteredEventListeners[event] = listener;
          } else {
            this.node.addEventListener(
              event,
              listener.listener,
              listener.options,
            );
            newRegisteredEventListeners[event] = { ...listener };
          }
        }
      }
    }
    for (const event in listenersToRemove) {
      const listener = listenersToRemove[event] as any;
      if (listener) {
        if (typeof listener === "function") {
          this.node.removeEventListener(event, listener);
        } else {
          this.node.removeEventListener(
            event,
            listener.listener,
            listener.options,
          );
        }
      }
    }
    this.registeredEventListeners = newRegisteredEventListeners;
  }
}

export type HTMLElementComponent<
  E extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap,
> = DOMElementComponent<E>;

export type SVGElementComponent<
  E extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap,
> = DOMElementComponent<E>;

type ReplaceHyphenWithLowLine<S extends string> =
  S extends `${infer A}-${infer B}` ? `${A}_${ReplaceHyphenWithLowLine<B>}` : S;

export type HTMLElementFuncs<C extends ContextState> = {
  [E in keyof HTMLElementTagNameMap as `_${ReplaceHyphenWithLowLine<E>}`]: DOMElementComponent<E> extends C["enabled"]
    ? (
        data?: Partial<HTMLElementTagNameMap[E]>,
        inner?: D<Content>,
        eventListeners?: DOMElementEventListenersInfo<E>,
      ) => void
    : never;
};

export type SVGElementFuncData = Record<
  string,
  D<undefined | string | number | ((...args: any[]) => any)>
>;

export type SVGElementFuncs<C extends ContextState> = {
  [E in keyof SVGElementTagNameMap as `_svg${Capitalize<E>}`]: DOMElementComponent<E> extends C["enabled"]
    ? (
        data?: SVGElementFuncData,
        inner?: D<Content>,
        eventListeners?: DOMElementEventListenersInfo<E>,
      ) => void
    : never;
};
