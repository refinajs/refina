import { DOMElementComponent } from "./element";

/**
 * The window component that manages event listeners of Window.
 *
 * **Note**: Window is not a DOM element in fact,
 *  but we just treat it as a DOM element to reuse the code to manage event listeners.
 */
export class DOMWindowComponent extends DOMElementComponent<any> {
  constructor(ikey: string, window: Window) {
    super(ikey, window);
  }

  updateDOM(): null {
    this.applyEventListeners();
    return null;
  }

  addEventListener<K extends keyof WindowEventMap>(
    event: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    // @ts-ignore Window is not a DOM element in fact.
    super.addEventListener(event, listener, options);
  }

  addCls(_classes: string): void {
    throw new Error("Cannot add classes to window.");
  }

  addCss(_style: string) {
    throw new Error("Cannot add styles to window.");
  }

  insertAfter(_node: ChildNode): never {
    throw new Error("Cannot insert window component after another node.");
  }

  prependTo(_parent: Element): never {
    throw new Error("Cannot prepend window component to DOM tree.");
  }

  removeFrom(_parent: Element): never {
    throw new Error("Cannot remove window component from DOM tree.");
  }
}
