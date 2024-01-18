import { App, RefTreeNode } from "../app";
import { Context, ContextState, InitialContextState } from "../context";
import { DOMElementComponent } from "../dom";

/**
 * The main function of a component.
 */
export type ComponentMainFunc = (...args: any) => void;

/**
 * The base class of all components.
 *
 * Each component should have a component class that extends this class.
 *
 * Register the component class to a plugin to make it available.
 */
export abstract class Component<Props> {
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
  $main() {
    this.$app.context.$updateContext?.$lowlevel.$$pendingMainElOwner.push(this);
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
  $mainFunc: ComponentMainFunc;
}

/**
 * The constructor type of **any** component class.
 */
export type ComponentConstructor<T extends Component<any>> = new (
  app: App,
) => T;

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

export type ComponentPropsKey<N extends string = string> =
  `${Capitalize<N>}Props`;

export type ComponentProps<N extends keyof Components> =
  ComponentPropsKey<N> extends keyof Components
    ? Components[ComponentPropsKey<N>]
    : {};

export type ComponentExposedKey<N extends string = string> =
  `${Capitalize<N>}Exposed`;

export type ComponentExposed<N extends keyof Components> =
  ComponentExposedKey<N> extends keyof Components
    ? Components[ComponentExposedKey<N>] & object
    : void;

interface ComponentOnlyContextFuncs<N extends keyof Components> {
  /**
   * Expose an object to the component instance, which can be referenced by user.
   *
   * This directive can only be called once outside of the main function.
   *
   * Declare the exposed object type via declaration merging:
   *
   * ```ts
   * declare module "refina" {
   *   interface Components {
   *     xComponent(arg: number): void;
   *     XComponentExposed: {
   *       exposedProp: number;
   *     };
   *   }
   * }
   * ```
   *
   * @param exposed The exposed object.
   */
  $expose<T extends ComponentExposed<N>>(exposed: T): T;
}

/**
 * The full component context type, with context funcs.
 */
export type ComponentContext<
  N extends keyof Components,
  CS extends ContextState = InitialContextState,
> = Context<CS> & ComponentOnlyContextFuncs<N>;

export interface ComponentRefTypeRawMap {}

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

/**
 * The map from component name to its ref type.
 */
export type ComponentRefTypeMap = UnionToIntersection<
  ComponentRefTypeRawMap[keyof ComponentRefTypeRawMap]
>;

// Add component functions to the context.
declare module "../context/base" {
  interface ContextFuncs<C> extends Components {}
}
