import { D } from "../data";
import { Content } from "./base";
import { DOMElementComponent } from "./domElement";

export class DOMPortalComponent extends DOMElementComponent {
  setClasses(_classes: string[]) {
    throw new Error("Cannot reset classes on portal");
  }
  setStyle(_style: string) {
    throw new Error("Cannot reset style on portal");
  }

  appendTo(_parent: Element) {}
  removeFrom(_parent: Element) {}
  insertBefore(_element: ChildNode) {}
  insertAfter(_element: ChildNode) {}
}

export type PortalMountTarget =
  | HTMLElement
  | DOMElementComponent<keyof HTMLElementTagNameMap>
  | string;

export type PortalFunc<C> = {
  portal: DOMPortalComponent extends C
    ? (inner: D<Content>, mountTarget?: PortalMountTarget) => void
    : never;
};
