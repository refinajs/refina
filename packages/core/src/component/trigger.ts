import { IntrinsicRecvContext, LowlevelContext } from "../context";
import {
  Component,
  ComponentContext,
  ComponentExposed,
  ComponentExposedKey,
  ComponentProps,
  ComponentPropsKey,
  Components,
} from "./component";

/**
 * The base class of all trigger components.
 *
 * A trigger component is a component that can fire events with data.
 * The return value of the context function is whether the event is fired.
 */
export class TriggerComponent<Ev, Props> extends Component<Props> {
  /**
   * Fire an event with data.
   *
   * @param data The data of the event.
   */
  readonly $fire = (data: Ev) => {
    this.$app.recv(this, data);
  };

  /**
   * Create a function that fires an event with data.
   *
   * @param data The data of the event.
   * @returns A function that fires the event.
   */
  readonly $fireWith = (data: Ev) => () => {
    this.$app.recv(this, data);
  };
}

/**
 * The names of all trigger components.
 */
export type TriggerComponentName = {
  [K in keyof Components]: K extends ComponentPropsKey | ComponentExposedKey
    ? never
    : Components[K] extends (...args: any) => // @ts-ignore
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
  Components[N] extends (...args: any) => // @ts-ignore
  this is {
    $ev: infer Ev;
  }
    ? Ev
    : never;

/**
 * The factory function of a trigger component.
 */
export type TriggerComponentFactory<N extends TriggerComponentName> = (
  this: TriggerComponent<TriggerComponentEvent<N>, ComponentProps<N>>,
  _: ComponentContext<N>,
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
  return function (
    this: LowlevelContext,
    ckey: string,
    ...args: unknown[]
  ): boolean {
    const component = this.$$processComponent(
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

declare module "./component" {
  interface ComponentRefTypeRawMap {
    triggerComponents: {
      [N in TriggerComponentName]: TriggerComponent<
        TriggerComponentEvent<N>,
        ComponentProps<N>
      > &
        ComponentExposed<N>;
    };
  }
}
