import { App, RefTreeNode } from "../app";
import { IntrinsicBaseContext, _ } from "../context";
import { DOMElementComponent } from "../dom";

/**
 * The base class of all components.
 *
 * Each component should have a component class that extends this class.
 *
 * Register the component class to a plugin to make it available.
 */
export abstract class Component {
  constructor() {
    this.$app = _.$app;
    this.$updateModel = _.$app.updateModel;
  }

  /**
   * The app that the component is installed on.
   */
  $app: App;

  /**
   * The ref tree node of the component.
   */
  $refTreeNode: RefTreeNode = {};

  /**
   * The primary element of the component.
   * If the component does not have a `HTMLElement` or `SVGElement`, it is `undefined`.
   * Set with `this.$main()` or be the first element of the component by default.
   */
  $primaryEl: DOMElementComponent | undefined;

  /**
   * Call this method to set the next element as the primary element of this component.
   */
  $primary(): void {
    _.$updateContext?.$lowlevel.$$pendingPrimaryElOwner.push(this);
  }

  /**
   * Trigger an `UPDATE` call.
   */
  protected $update() {
    this.$app.update();
  }

  /**
   * Set the value of a model and trigger an `UPDATE` call if the value is changed.
   *
   * @param model The model.
   * @param v The new value.
   * @returns Whether the value is changed.
   */
  protected $updateModel: App["updateModel"];

  abstract $main(...args: any): any;
}

export function isComponentCtor(ctor: Function): ctor is new () => Component {
  return "prototype" in ctor && ctor.prototype instanceof Component;
}

export function toComponentFunc(ctor: new () => Component) {
  return function (ckey: string, ...args: any) {
    return (_ as unknown as IntrinsicBaseContext).$$processComponent(
      ckey,
      ctor,
      args,
    );
  };
}

export interface Components {}
