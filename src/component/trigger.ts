import { Context, ToFullContext, contextFuncs } from "../context";
import {
  IntrinsicComponentContext,
  ComponentConstructor,
  Component,
  ComponentFuncArgs,
} from "./component";

export abstract class TriggerComponent<Ev = unknown> extends Component {
  abstract main(_: TriggerComponentContext<this>, ...args: any[]): void;
}
export type TriggerComponentEventData<S extends TriggerComponent> =
  S extends TriggerComponent<infer Ev> ? Ev : never;
export class IntrinsicTriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $fire = (data: TriggerComponentEventData<S>) => {
    this.$view.recv(this.$component.ikey, data);
  };
  $fireWith = (data: TriggerComponentEventData<S>) => () => {
    this.$fire(data);
  };
}
export type TriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicTriggerComponentContext<S, C, Ev>>;
export function triggerComponent<S extends TriggerComponent>(
  ctor: ComponentConstructor<S>
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);

  contextFuncs[name] = function (this: Context, ckey, ...args) {
    const component = this.beginComponent(ckey, ctor);

    const context = new IntrinsicTriggerComponentContext(this, component);

    component.main(context as unknown as TriggerComponentContext<S>, ...args);

    const isReceiver = this.$view.isReceiver;

    if (!context.$classesArgUsed) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    context.$callHookAfterThisComponent();

    this.endComponent(ckey);

    return isReceiver;
  };
  return ctor;
}
export interface TriggerComponents extends Record<string, TriggerComponent> {}

export type TriggerComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C
    ? (
        ...args: ComponentFuncArgs<TriggerComponents[K]>
        //@ts-ignore
      ) => this is Context<
        TriggerComponents[K],
        TriggerComponentEventData<TriggerComponents[K]>
      >
    : never;
};
