import { Context, IntrinsicRecvContext } from "../context";
import { Component, Components } from "./component";

/**
 * The base class of all trigger components.
 *
 * A trigger component is a component that can fire events with data.
 * The return value of the context function is whether the event is fired.
 */
export class TriggerComponent<Ev, Props = {}> extends Component<Props> {
  /**
   * Fire an event with data.
   *
   * @param data The data of the event.
   */
  readonly $fire = (data: Ev) => {
    if (
      typeof data === "object" &&
      data !== null &&
      data instanceof Event &&
      !Object.hasOwn(data, "$isCurrent")
    ) {
      (data as any).$isCurrent = data.target === data.currentTarget;
    }
    this.$app.recv(this, data);
  };

  /**
   * Create a function that fires an event with data.
   *
   * @param data The data of the event.
   * @returns A function that fires the event.
   */
  readonly $fireWith = (data: Ev) => () => {
    this.$fire(data);
  };
}

/**
 * The names of all trigger components.
 */
export type TriggerComponentName = {
  [K in keyof Components]: Components[K] extends (
    ...args: any[]
  ) => // @ts-ignore
  this is {
    $ev: infer _Ev;
  }
    ? K
    : never;
}[keyof Components];

/**
 * Extract the event type of a trigger component.
 */
export type TriggerComponentEvent<N extends TriggerComponentName> =
  Components[N] extends (...args: any[]) => // @ts-ignore
  this is {
    $ev: infer Ev;
  }
    ? Ev
    : never;

/**
 * The factory function of a trigger component.
 */
export type TriggerComponentFactory<N extends TriggerComponentName> = (
  this: Readonly<TriggerComponent<TriggerComponentEvent<N>>>,
  _: Context,
) => Components[N];

/**
 * The trigger component factory function map.
 */
export type TriggerComponentFactoryMap = {
  [N in TriggerComponentName]: TriggerComponentFactory<N>;
};

/**
 * Create a context function of a trigger component.
 *
 * @param ctor The component class constructor.
 * @returns The context function.
 */
export function createTriggerComponentFunc(
  factory: TriggerComponentFactory<TriggerComponentName>,
) {
  return function (this: Context, ckey: string, ...args: unknown[]): boolean {
    const component = this.$intrinsic.$$processComponent(
      ckey,
      TriggerComponent,
      factory,
      args,
    );

    // If the component is the current event receiver, return `true`.
    if (this.$app.isEventReceiver(component)) {
      // Set `$received` to `true` to skip checking the rest components.
      (this as unknown as IntrinsicRecvContext).$received = true;
      return true;
    } else {
      return false;
    }
  };
}
