import {
  Context,
  CustomContext,
  ToFullContext,
  contextFuncs,
} from "../context";
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
    if (typeof data === "object" && data !== null && data instanceof Event) {
      data = {
        ...data,
        $isCurrent: data.target === data.currentTarget,
      };
    }
    this.$app.recv(this.$component.ikey, data);
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

export function triggerComponent<
  N extends keyof TriggerComponents | keyof CustomContext<any>,
>(name: N) {
  return <T extends ComponentConstructor<TriggerComponent<any>>>(ctor: T) => {
    //@ts-ignore
    contextFuncs[name] = function (this: Context, ckey, ...args) {
      const component = this.beginComponent(
        ckey,
        ctor,
      ) as TriggerComponent<any>;

      const context = new IntrinsicTriggerComponentContext(this, component);

      component.main(
        context as unknown as TriggerComponentContext<
          unknown,
          TriggerComponent<any>
        >,
        ...args,
      );

      const isReceiver = this.$app.isReceiver;

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
    ? (
        ...args: ComponentFuncArgs<TriggerComponents[K]>
        //@ts-ignore
      ) => this is TriggerComponentFuncAssertThisType<
        TriggerComponentEventData<TriggerComponents[K]>,
        TriggerComponents[K]
      >
    : never;
};
