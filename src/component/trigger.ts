import { Context, ToFullContext, contextFuncs } from "../context";
import {
  IntrinsicComponentContext,
  ComponentContextClass,
  ComponentConstructor,
  Component,
  ComponentFuncArgs,
} from "./component";

export abstract class TriggerComponent<Ev = unknown> extends Component {
  abstract main(_: TriggerComponentContext<this>, ...args: any[]): void;
}
export type TriggerComponentEventData<S extends TriggerComponent> =
  S extends TriggerComponent<infer Ev> ? Ev : never;
interface IntrinsicTriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $fire: (data: any) => void;
  $fireWith: (data: any) => () => void;
}
export type TriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicTriggerComponentContext<S, C, Ev>>;
export class TriggerComponentContextClass<S extends TriggerComponent>
  extends ComponentContextClass<S>
  implements IntrinsicTriggerComponentContext<S>
{
  $fire = (data: TriggerComponentEventData<S>) => {
    this.$view.fire(this.$component.ikey, data);
  };
  $fireWith = (data: TriggerComponentEventData<S>) => () => {
    this.$fire(data);
  };
}
export function triggerComponent<S extends TriggerComponent>(
  ctor: ComponentConstructor<S>
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);

  contextFuncs[name] = function (this: Context, ckey, ...args) {
    const component = this.beginComponent(ckey, ctor);

    const context = new TriggerComponentContextClass(
        this.$view,
      component,
      this.$classes
    );

    component.main(context as unknown as TriggerComponentContext<S>, ...args);

    const isReceiver = this.$view.isReceiver;

    if (!context.$classesArgUsed) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    this.endComponent();

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
