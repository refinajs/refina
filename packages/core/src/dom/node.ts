/**
 * Utility type for a nullable child node.
 *
 * Used in return values of DOM node component methods.
 */
export type MaybeChildNode = ChildNode | null;

/**
 * The base class for DOM node components.
 *
 * Defines the common methods for DOM node components.
 */
export abstract class DOMNodeComponent<N extends Node = Node> {
  /**
   * @param node The DOM node of this component.
   */
  constructor(public node: N) {}

  /**
   * In this method, the component should update the DOM node to reflect the current state.
   *
   * This method is called by the node's parent DOM component
   *  after `UPDATE` call of the app main function.
   *
   * 1. DOM tree structure should be updated.
   * 2. Class names and styles should be updated.
   *
   * @returns The last updated **child** node. If no child node is updated, returns `null`.
   */
  abstract updateDOM(): MaybeChildNode;

  /**
   * The node for the parent DOM element to manage.
   */
  get asChildNode(): MaybeChildNode {
    return this.node as unknown as MaybeChildNode;
  }

  /**
   * Insert the DOM node after the given element.
   *
   * @param node The element to insert after.
   */
  insertAfter(node: ChildNode): void {
    node.after(this.node);
  }

  /**
   * Prepend the DOM node to the parent DOM element.
   *
   * @param parent The parent DOM element to prepend to.
   */
  prependTo(parent: Element): void {
    parent.prepend(this.node);
  }

  /**
   * Remove the DOM node from its parent.
   *
   * @param parent The parent DOM element to remove from.
   */
  removeFrom(parent: Element): void {
    parent.removeChild(this.node);
  }
}
