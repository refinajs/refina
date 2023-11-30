import { DOMElementComponent } from "./element";
import { MaybeChildNode } from "./node";
import { DOMPortalComponent } from "./portal";

/**
 * The root component of the app.
 *
 * There should be only one root component,
 *  representing the element with id passed too the `App` constructor.
 *
 * This component manages top-level components of the app and portals.
 */
export class DOMRootComponent extends DOMElementComponent<
  keyof HTMLElementTagNameMap
> {
  /**
   * Portals that have not been updated to the DOM tree.
   */
  pendingPortals: DOMPortalComponent[] = [];

  /**
   * Portals that is currently mounted to the DOM tree.
   */
  protected mountedPortals = new Set<DOMPortalComponent>();

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K & string,
    listener: (this: HTMLAnchorElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    // @ts-ignore
    return super.addEventListener(type, listener, options);
  }

  updateDOM(): MaybeChildNode {
    // Apply cls and css, register event listeners, and update direct children.
    let lastNode = super.updateDOM();

    const portalsToRemove = this.mountedPortals;

    for (const portal of this.pendingPortals) {
      // Update the portal.
      lastNode = portal.updateMount(lastNode);
      // Do not remove the portal.
      portalsToRemove.delete(portal);
    }

    // Remove unused portals.
    for (const unusedPortal of portalsToRemove) {
      unusedPortal.unmount();
    }

    this.mountedPortals = new Set(this.pendingPortals);

    // Reset the pending portals for the next `UPDATE` call.
    this.pendingPortals = [];

    return lastNode;
  }

  insertAfter(_node: ChildNode): never {
    throw new Error("Cannot insert root component after another node.");
  }

  prependTo(_parent: Element): never {
    throw new Error("Cannot prepend root component to DOM tree.");
  }

  removeFrom(_parent: Element): never {
    throw new Error("Cannot remove root component from DOM tree.");
  }
}
