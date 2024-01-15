import { Context, IntrinsicBaseContext } from "../context";
import {
  Component,
  ComponentContext,
  ComponentExposedKey,
  ComponentMainFunc,
  ComponentProps,
  ComponentPropsKey,
  Components,
  createComponentDefiner,
} from "./component";
/**
 * The base class of all status components.
 *
 * A status component is a component that has a status.
 *
 * The context functions of status components return the current status.
 */
export class StatusComponent<Status, Props> extends Component<Props> {
  $_status: Status;

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
}

/**
 * The name of all status components.
 */
export type StatusComponentName = {
  [K in keyof Components]: K extends ComponentPropsKey | ComponentExposedKey
    ? never
    : ((...args: any) => void) extends Components[K]
    ? never
    : K;
}[keyof Components];

/**
 * Extract the status type of a status component.
 */
export type StatusComponentStatus<N extends StatusComponentName> =
  Components[N] extends (...args: any) => infer S ? S : never;

/**
 * The factory function of a status component.
 */
export type StatusComponentFactory<
  N extends StatusComponentName = StatusComponentName,
> = (
  this: StatusComponent<StatusComponentStatus<N>, ComponentProps<N>>,
  _: ComponentContext<N>,
) => (...args: Parameters<Components[N]>) => void;

/**
 * The status component factory function map.
 */
export type StatusComponentFactoryMap = {
  [N in StatusComponentName]: StatusComponentFactory<N>;
};

/**
 * Create a context function of a status component.
 *
 * @returns The context function.
 */
export function createStatusComponentFunc(factory: StatusComponentFactory) {
  return function (
    this: IntrinsicBaseContext,
    ckey: string,
    ...args: unknown[]
  ): unknown {
    const component = this.$$processComponent(
      ckey,
      StatusComponent,
      factory as (
        this: StatusComponent<any, any>,
        context: Context,
      ) => ComponentMainFunc,
      args,
    );

    // If the component is the current event receiver, return `true`.
    return component.$status;
  };
}

/**
 * Define a status component.
 *
 * @param factory The factory function.
 */
export const $defineStatus = createComponentDefiner(createStatusComponentFunc);

declare module "./component" {
  interface ComponentRefTypeRawMap {
    statusComponnents: {
      [N in StatusComponentName]: StatusComponent<
        StatusComponentStatus<N>,
        ComponentProps<N>
      > &
        ComponentExposed<N>;
    };
  }
}
