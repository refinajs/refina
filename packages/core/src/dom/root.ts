import { DOMNodeComponentActionResult } from "./base";
import { DOMElementComponent } from "./domElement";
import { DOMPortalComponent } from "./portal";

export class DOMRootComponent extends DOMElementComponent<
  keyof HTMLElementTagNameMap
> {
  portals = new Set<DOMPortalComponent>();
  protected createdPortals = new Set<DOMPortalComponent>();

  createDOM(): DOMNodeComponentActionResult {
    let lastEl = super.createDOM().lastEl;
    for (const portal of this.portals) {
      lastEl = portal.mount(lastEl) ?? lastEl;
      this.createdPortals.add(portal);
    }
    return {
      lastEl,
      thisEl: this.node,
    };
  }

  updateDOM(): DOMNodeComponentActionResult {
    let lastEl = super.updateDOM().lastEl;
    const createdUnusedPortals = new Set(this.createdPortals);
    for (const portal of this.portals) {
      if (this.createdPortals.has(portal)) {
        lastEl = portal.updateMount(lastEl) ?? lastEl;
        createdUnusedPortals.delete(portal);
      } else {
        lastEl = portal.mount(lastEl) ?? lastEl;
      }
    }
    for (const unusedPortal of createdUnusedPortals) {
      unusedPortal.unmount();
    }
    this.createdPortals = new Set(this.portals);
    return {
      lastEl,
      thisEl: this.node,
    };
  }

  appendTo(_parent: Element): never {
    throw new Error("Cannot append root");
  }
  removeFrom(_parent: Element): never {
    throw new Error("Cannot remove root");
  }
  prependTo(_element: ChildNode): never {
    throw new Error("Cannot insert before root");
  }
  insertAfter(_element: ChildNode): never {
    throw new Error("Cannot insert after root");
  }
}
