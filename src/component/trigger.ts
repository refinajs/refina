import { Context, ToFullContext, contextFuncs } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
  componentRegister,
} from "./component";

export abstract class TriggerComponent extends Component {
  abstract main(_: TriggerComponentContext<any, this>, ...args: any[]): void;
}
export type TriggerComponentEventData<S extends TriggerComponent> = S extends {
  main(_: TriggerComponentContext<infer Ev, any>, ...args: any[]): any;
}
  ? Ev
  : never;
export class IntrinsicTriggerComponentContext<
  Ev,
  S extends TriggerComponent,
  C = any,
> extends IntrinsicComponentContext<S, C> {
  $fire = (data: Ev) => {
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
  S extends TriggerComponent,
  C = any,
> = ToFullContext<C, IntrinsicTriggerComponentContext<Ev, S, C>>;

export const triggerComponent = componentRegister<
  <S extends TriggerComponent>(
    ctor: ComponentConstructor<S>,
  ) => ComponentConstructor<S>
>(<S extends TriggerComponent>(ctor: ComponentConstructor<S>, name: string) => {
  contextFuncs[name] = function (this: Context, ckey, ...args) {
    const component = this.beginComponent(ckey, ctor);

    const context = new IntrinsicTriggerComponentContext(this, component);

    component.main(
      context as unknown as TriggerComponentContext<unknown, S>,
      ...args,
    );

    const isReceiver = this.$view.isReceiver;

    if (!context.$classesArgUsed) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    this.endComponent(ckey);

    return isReceiver;
  };
  return ctor;
});

export interface TriggerComponents extends Record<string, TriggerComponent> {}

export type TriggerComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C
    ? (
        ...args: ComponentFuncArgs<TriggerComponents[K]>
        //@ts-ignore
      ) => this is {
        readonly $: TriggerComponents[K];
        readonly $ev: TriggerComponentEventData<TriggerComponents[K]>;
      }
    : never;
};
