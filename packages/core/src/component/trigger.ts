import { Context } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class TriggerComponent<Ev> extends Component {
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
    return false as const;
  };
  protected $fireWith = (data: Ev) => () => {
    this.$fire(data);
    return false as const;
  };
  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}

export type TriggerComponentEventData<S extends TriggerComponent<any>> =
  S extends TriggerComponent<infer Ev> ? Ev : never;

export function createTriggerComponentFunc<
  T extends ComponentConstructor<TriggerComponent<any>>,
>(ctor: T) {
  return function (this: Context, ckey: any, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as TriggerComponent<any>;

    const context = new IntrinsicComponentContext(this, component);

    component.main(
      context as unknown as ComponentContext<TriggerComponent<any>>,
      ...args,
    );

    const isReceiver = this.$app.isReceiver;

    if (!context.$mainEl) {
      context.$mainEl = context.$firstHTMLELement?.$mainEl ?? null;
      context.$firstHTMLELement?.addClasses(context.$classesArg);
      context.$firstHTMLELement?.addStyle(context.$styleArg);
    }

    component.$mainEl = context.$mainEl;

    this.$endComponent(component, ckey);

    return isReceiver;
  };
}

export interface TriggerComponents {}

export type TriggerComponentFuncAssertThisType<Ev, C> = {
  readonly $: C;
  readonly $ev: Ev extends Event
    ? Ev & {
        readonly $isCurrent: boolean;
      }
    : Ev;
};

export type TriggerComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C
    ? (...args: ComponentFuncArgs<TriggerComponents[K]>) => //@ts-ignore
      this is TriggerComponentFuncAssertThisType<
        TriggerComponentEventData<TriggerComponents[K]>,
        TriggerComponents[K]
      >
    : never;
};
