import { DOMElementComponent } from "./element";

/**
 * The window component that manages event listeners of Window.
 *
 * **Note**: Window is not a DOM element in fact,
 *  but we just treat it as a DOM element to reuse the code to manage event listeners.
 */
export class DOMWindowComponent extends DOMElementComponent<any> {
  updateDOM(): null {
    this.applyEventListeners();
    return null;
  }

  addCls(_classes: string): void {
    throw new Error("Cannot add classes to window.");
  }

  addCss(_style: string) {
    throw new Error("Cannot add styles to window.");
  }

  addAttrs(_attrs: Partial<this["node"]>): void {
    throw new Error("Cannot add attrs to window.");
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
