import { App, RefTreeNode } from "../app";
import { AppStateType } from "../constants";
import { Context } from "../context";
import { DOMElementComponent } from "../dom";

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
    const appState = this.$app.state;
    if (appState.type === AppStateType.UPDATE) {
      appState.pendingMainElOwner.push(this);
    }
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
   * @param _ The context of the main function.
   * @param args The arguments of the component function. The type of the arguments should be specified.
   */
  abstract main(_: Context, ...args: unknown[]): void;
}

/**
 * The constructor type of **any** component class.
 */
export type ComponentConstructor<S extends Component = Component> = new (
  app: App,
) => S;

/**
 * Extract the arguments type of a component function.
 */
export type ComponentFuncArgs<S extends Component> = S extends {
  main(_: unknown, ...args: infer A): void;
}
  ? A
  : never;
