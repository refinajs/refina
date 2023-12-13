import { App, RefTreeNode } from "../app";
import { DOMElementComponent } from "../dom";

/**
 * The main function of a component.
 */
export type ComponentMainFunc = (...args: any[]) => void;

/**
 * The base class of all components.
 *
 * Each component should have a component class that extends this class.
 *
 * Register the component class to a plugin to make it available.
 */
export abstract class Component<Props = {}> {
  /**
   * @param $app The app that the component is installed on.
   */
  constructor(public readonly $app: App) {}

  /**
   * The ref tree node of the component.
   */
  $refTreeNode: RefTreeNode = {};

  /**
   * The props of the component set by component function caller using `_.$prop()` or `_.$props()`.
   */
  $props: Partial<Props>;

  /**
   * The main element of the component.
   * If the component does not have a `HTMLElement` or `SVGElement`, it is `undefined`.
   * Set with `this.$main()` or be the first element of the component by default.
   */
  $mainEl: DOMElementComponent | undefined;

  /**
   * Call this method to set the next element as the main element of this component.
   */
  protected $main() {
    this.$app.context.$updateContext?.$intrinsic.$$pendingMainElOwner.push(
      this,
    );
  }

  /**
   * Trigger an `UPDATE` call.
   */
  protected $update() {
    this.$app.update();
  }

  /**
   * The main function of the component.
   * In this function, the component should render its content and receive event under `RECV` state.
   *
   * @param args The arguments of the component function. The type of the arguments should be specified.
   */
  main: ComponentMainFunc;
}

/**
 * The constructor type of **any** component class.
 */
export type ComponentConstructor<T extends Component> = new (app: App) => T;

/**
 * The components map.
 *
 * Add your components to this map using declaration merging:
 *
 * ```ts
 * declare module "refina" {
 *   interface Components {
 *     anOutputComponent(arg?: number): void;
 *     aTriggerComponent(arg: string): this is { $ev: EventDataType };
 *     aStatusComponent<T>(arg: T): StatusEnum;
 *   }
 * }
 * ```
 *
 * **Note**: Generic types and overloaded functions are supported.
 */
export interface Components {}

// Add component functions to the context.
declare module "../context/base" {
  interface ContextFuncs<C> extends Components {}
}
