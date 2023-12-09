import { Context, ContextState } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
} from "./component";

/**
 * The base class of all trigger components.
 *
 * A trigger component is a component that can fire events with data.
 * The return value of the context function is whether the event is fired.
 *
 * Register the component class using `@Plugin.triggerComponent(name)` to make it available.
 */
export abstract class TriggerComponent<
  Ev,
  Props = {},
> extends Component<Props> {
  /**
   * Fire an event with data.
   *
   * @param data The data of the event.
   */
  protected $fire = (data: Ev) => {
    if (
      typeof data === "object" &&
      data !== null &&
      data instanceof Event &&
      !Object.hasOwn(data, "$isCurrent")
    ) {
      (data as any).$isCurrent = data.target === data.currentTarget;
    }
    this.$app.recv(this.$ikey, data);
  };

  /**
   * Create a function that fires an event with data.
   *
   * @param data The data of the event.
   * @returns A function that fires the event.
   */
  protected $fireWith = (data: Ev) => () => {
    this.$fire(data);
  };

  abstract main(_: Context, ...args: any[]): void;
}

/**
 * Extract the event data type of a trigger component.
 */
export type TriggerComponentEventData<S extends TriggerComponent<any>> =
  S extends TriggerComponent<infer Ev> ? Ev : never;

/**
 * Create a context function of an trigger component.
 *
 * @param ctor The component class.
 * @returns The context function.
 */
export function createTriggerComponentFunc<
  T extends ComponentConstructor<TriggerComponent<any>>,
>(ctor: T) {
  return function (this: Context, ckey: any, ...args: any[]): boolean {
    const component = this.$$processComponent(ckey, ctor, args);

    // If the component is the current event receiver, return `true`.
    return this.$app.isEventReceiver(component.$ikey);
  };
}

/**
 * The trigger components map to add the component functions to the context in one go.
 *
 * Add your trigger components to this map using declaration merging:
 *
 * ```ts
 * declare module "refina" {
 *   interface TriggerComponents {
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
export interface TriggerComponents {}

/**
 * The additional context properties when receiving the event.
 *
 * Use `this is TriggerComponentFuncAssertThisType` as the return type of the component function,
 * to let TypeScript know that the context properties are available.
 */
export type TriggerComponentFuncAssertThisType<Ev> = {
  /**
   * The event that the app is receiving.
   */
  readonly $ev: Ev extends Event
    ? Ev & {
        /**
         * Whether `ev.target` is the same as `ev.currentTarget`.
         */
        readonly $isCurrent: boolean;
      }
    : Ev;
};

/**
 * The component functions of trigger components in `TriggerComponents` interface.
 */
export type TriggerComponentFuncs<C extends ContextState> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C["enabled"]
    ? (...args: ComponentFuncArgs<TriggerComponents[K]>) => // @ts-ignore
      this is TriggerComponentFuncAssertThisType<
        TriggerComponentEventData<TriggerComponents[K]>
      >
    : never;
};

// Add trigger component functions to the context.
declare module "../context/base" {
  interface ContextFuncs<C> extends TriggerComponentFuncs<C> {}
}
