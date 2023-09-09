import { Context, ToFullContext, contextFuncs } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class TriggerComponent<Ev> extends Component {
  abstract main(_: TriggerComponentContext<Ev, this>, ...args: any[]): void;
}

export type TriggerComponentEventData<S extends TriggerComponent<any>> =
  S extends TriggerComponent<infer Ev> ? Ev : never;

export class IntrinsicTriggerComponentContext<
  Ev,
  S extends TriggerComponent<Ev>,
  C = any,
> extends IntrinsicComponentContext<S, C> {
  $fire = (data: Ev) => {
    if (
      typeof data === "object" &&
      data !== null &&
      (data as object) instanceof Event
    ) {
      //@ts-ignore
      data.$isCurrent = data.target === data.currentTarget;
    }
    this.$view.recv(this.$component.ikey, data);
    return false;
  };
  $fireWith = (data: Ev) => () => {
    this.$fire(data);
    return false;
  };
}
export type TriggerComponentContext<
  Ev,
  S extends TriggerComponent<Ev>,
  C = any,
> = ToFullContext<C, IntrinsicTriggerComponentContext<Ev, S, C>>;

export function triggerComponent<N extends keyof TriggerComponents>(name: N) {
  return (ctor: ComponentConstructor<TriggerComponents[N]>) => {
    //@ts-ignore
    contextFuncs[name] = function (this: Context, ckey, ...args) {
      const component = this.beginComponent(ckey, ctor) as TriggerComponents[N];

      const context = new IntrinsicTriggerComponentContext(this, component);

      component.main(
        context as unknown as TriggerComponentContext<
          unknown,
          TriggerComponents[N]
        >,
        ...args,
      );

      const isReceiver = this.$view.isReceiver;

      if (!context.$classesAndStyleUsed) {
        context.$firstHTMLELement?.addClasses(context.$classesArg);
        context.$firstHTMLELement?.addStyle(context.$styleArg);
      }

      this.endComponent(ckey);

      return isReceiver;
    };
    return ctor;
  };
}

export interface TriggerComponents
  extends Record<string, TriggerComponent<any>> {}

export type TriggerComponentFuncAssertThisType<
  Ev,
  C extends TriggerComponent<Ev>,
> = {
  readonly $: C;
  readonly $ev: Ev extends Event
    ? Ev & {
        $isCurrent: boolean;
      }
    : Ev;
};

export type TriggerComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C
    ? (
        ...args: ComponentFuncArgs<TriggerComponents[K]>
        //@ts-ignore
      ) => this is TriggerComponentFuncAssertThisType<
        TriggerComponentEventData<TriggerComponents[K]>,
        TriggerComponents[K]
      >
    : never;
};
