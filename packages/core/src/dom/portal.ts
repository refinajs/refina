import { Prelude } from "../constants";
import { Context, IntrinsicContext } from "../context";
import { D, getD } from "../data";
import { View } from "../view";
import {
  DOMNodeComponent,
  DOMNodeComponentActionResult,
  MaybeChildNode,
} from "./base";
import { DOMElementComponent } from "./domElement";

export class DOMPortalComponent extends DOMElementComponent {
  protected childrenToRemove: Set<DOMNodeComponent>;

  createDOM(): DOMNodeComponentActionResult {
    let lastEl: MaybeChildNode = null;
    for (const child of this.children) {
      lastEl = child.createDOM().thisEl ?? lastEl;
      this.createdChildren.add(child);
    }
    return {
      lastEl,
      thisEl: null,
    };
  }
  updateDOM(): DOMNodeComponentActionResult {
    let lastEl: MaybeChildNode = null;
    this.childrenToRemove = new Set<DOMNodeComponent>(this.createdChildren);
    for (const child of this.children) {
      if (this.createdChildren.has(child)) {
        lastEl = child.updateDOM().thisEl ?? lastEl;
        this.childrenToRemove.delete(child);
      } else {
        lastEl = child.createDOM().thisEl ?? lastEl;
      }
    }
    this.createdChildren = new Set(this.children);
    return {
      lastEl,
      thisEl: null,
    };
  }

  mount(lastEl: MaybeChildNode) {
    for (const child of this.children) {
      if (lastEl === null) {
        if (this.node.firstChild) {
          lastEl = child.prependTo(this.node) ?? lastEl;
        } else {
          lastEl = child.appendTo(this.node) ?? lastEl;
        }
      } else {
        lastEl = child.insertAfter(lastEl) ?? lastEl;
      }
    }
    return lastEl;
  }
  updateMount(lastEl: MaybeChildNode) {
    for (const child of this.children) {
      if (!this.createdChildren.has(child)) {
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
    for (const child of this.childrenToRemove) {
      child.removeFrom(this.node);
    }
    return lastEl;
  }
  unmount() {
    for (const child of this.createdChildren) {
      child.removeFrom(this.node);
    }
  }

  setClasses(_classes: string[]) {
    throw new Error("Cannot reset classes on portal");
  }
  setStyle(_style: string) {
    throw new Error("Cannot reset style on portal");
  }

  appendTo(_parent: Element) {
    return null;
  }
  prependTo(_parent: Element) {
    return null;
  }
  insertAfter(_element: ChildNode) {
    return null;
  }
  removeFrom(_parent: Element) {}
}

Prelude.register("portal", function (ckey: string, inner: D<View>) {
  this.$app.callAndResetHook("afterThisComponent");

  const ikey = this.$app.pushKey(ckey);
  this.$app.markComponentProcessed(ikey);

  const oldParent = this.$app.currentDOMParent;

  let portal = this.$app.refMap.get(ikey) as DOMPortalComponent;

  if (!portal) {
    portal = new DOMPortalComponent(ikey, this.$app.root.node);
    this.$app.refMap.set(ikey, portal);
  }
  oldParent.children.push(portal);
  this.$app.root.portals.add(portal);
  portal.children = [];

  const context = new IntrinsicContext(this.$app);

  this.$setRef(portal);

  if (this.$isNoPreserve) {
    if (this.$pendingNoPreserve === "deep") context.$allNoPreserve = true;
    else throw new Error(`Portal cannot be no-preserve.`);
  }

  this.$app.currentDOMParent = portal!;

  getD(inner)(context as unknown as Context);

  this.$app.callAndResetHook("afterThisComponent");

  this.$app.currentDOMParent = oldParent;

  this.$app.popKey(ckey);

  return portal!;
});

declare module "../context" {
  interface CustomContext<C> {
    portal: DOMPortalComponent extends C ? (inner: D<View>) => void : never;
  }
}
