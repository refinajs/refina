import { DOMElementComponent } from "./element";

/**
 * The body component that manages classes, styles and event listeners of the `<body>` element.
 */
export class DOMBodyComponent extends DOMElementComponent {
  updateDOM(): null {
    this.applyCls();
    this.applyCss();
    this.applyEventListeners();
    return null;
  }

  insertAfter(_node: ChildNode): never {
    throw new Error("Cannot insert body component after another node.");
  }

  prependTo(_parent: Element): never {
    throw new Error("Cannot prepend body component to DOM tree.");
  }

  removeFrom(_parent: Element): never {
    throw new Error("Cannot remove body component from DOM tree.");
  }
}
