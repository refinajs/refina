import { Context, ContextState } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
} from "./component";

/**
 * The base class of all status components.
 *
 * An status component is a component that has a status.
 *
 * The context functions of status components return the current status.
 *
 * Register the component class using `@Plugin.statusComponent(name)` to make it available.
 *
 * **Note**: Prefer using `ToggleComponent` if the component has a `boolean` status.
 */
export abstract class StatusComponent<
  Status,
  Props = {},
> extends Component<Props> {
  protected $_status: Status;

  /**
   * The current status of the component.
   */
  get $status() {
    return this.$_status;
  }

  /**
   * Set the current status of the component.
   *
   * If the status is changed, trigger an `UPDATE` call.
   *
   * @param v The new status.
   */
  set $status(v: Status) {
    if (this.$_status === v) return;
    this.$_status = v;
    this.$update();
  }

  abstract main(_: Context, ...args: any[]): void;
}

/**
 * The base class of all trigger components.
 *
 * A status component is a component that has a `boolean` status.
 *
 * The context functions of status components return the current status.
 *
 * Register the component class using `@Plugin.statusComponent(name)` to make it available.
 *
 * **Note**: This is a special case of `StatusComponent` where the status is `boolean`.
 * To have more than two status, use `StatusComponent` instead.
 */
export abstract class ToggleComponent<Props = {}> extends StatusComponent<
  boolean,
  Props
> {
  // Set the default status to `false`.
  protected $_status = false;

  /**
   * If the status is `false`, set it to `true` and trigger an `UPDATE` call.
   */
  $on = () => {
    this.$status = true;
  };

  /**
   * If the status is `true`, set it to `true` and trigger an `UPDATE` call.
   */
  $off = () => {
    this.$status = false;
  };

  /**
   * If the status is `true`, set it to `false`. Otherwise, set it to `true`.
   * Then trigger an `UPDATE` call.
   */
  $toggle = () => {
    this.$status = !this.$status;
  };
}

/**
 * Create a context function of an status component.
 *
 * @param ctor The component class.
 * @returns The context function.
 */
export function createStatusComponentFunc<
  T extends ComponentConstructor<StatusComponent<any>>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$$processComponent(ckey, ctor, args);

    // The return value of the context function is the status of the component.
    return component.$status;
  };
}

/**
 * Extract the status type of a status component.
 */
export type StatusComponentStatusType<C extends ContextState> =
  C extends StatusComponent<infer S> ? S : never;

/**
 * The status components map to add the component functions to the context in one go.
 *
 * Add your status components to this map using declaration merging:
 *
 * ```ts
 * declare module "refina" {
 *   interface StatusComponents {
 *     contextFuncName: ComponentClass;
 *   }
 * }
 * ```
 *
 * The keys are the context function names of the components.
 * And the values are the corresponding component classes.
 *
 * **Warning**: Do not add components that have generic types to this map.
 * Because the types of the component functions are not inferred.
 * Use `ContextFuncs` interface instead.
 */
export interface StatusComponents {}

/**
 * The component functions of status components in `StatusComponents` interface.
 */
export type StatusComponentFuncs<C extends ContextState> = {
  [K in keyof StatusComponents]: StatusComponents[K] extends C["enabled"]
    ? (
        ...args: ComponentFuncArgs<StatusComponents[K]>
      ) => StatusComponentStatusType<StatusComponents[K]>
    : never;
};

// Add output component functions to the context.
declare module "../context" {
  interface ContextFuncs<C> extends StatusComponentFuncs<C> {}
}
