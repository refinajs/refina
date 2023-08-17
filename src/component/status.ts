import { ToFullContext, contextFuncs, Context } from "../context";
import {
  Component,
  ComponentConstructor,
  IntrinsicComponentContext,
  ComponentFuncArgs,
} from "./component";

export abstract class StatusComponent extends Component {
  $status: boolean;
  abstract main(_: StatusComponentContext<this>, ...args: any[]): void;
}
export class IntrinsicStatusComponentContext<
  S extends StatusComponent,
  C = any,
> extends IntrinsicComponentContext<S, C> {
  get $status() {
    return this.$component.$status;
  }
  set $status(v: boolean) {
    if (this.$component.$status === v) return;
    this.$component.$status = v;
    this.$refresh();
  }
  $on = () => {
    this.$status = true;
  };
  $off = () => {
    this.$status = false;
  };
  $toggle = () => {
    this.$status = !this.$status;
  };
}
export type StatusComponentContext<
  S extends StatusComponent,
  C = any,
> = ToFullContext<C, IntrinsicStatusComponentContext<S, C>>;
export function statusComponent<S extends StatusComponent>(
  ctor: ComponentConstructor<S>,
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);
  contextFuncs[name] = function (this: Context, ckey, ...args) {
    const component = this.beginComponent(ckey, ctor);

    component.$status ??= false;

    const context = new IntrinsicStatusComponentContext(this, component);

    component.main(
      context as any as StatusComponentContext<
        S & {
          $status: boolean;
        }
      >,
      ...args,
    );

    if (!context.$classesArgUsed) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    this.endComponent(ckey);

    return component.$status;
  };
  return ctor;
}
export interface StatusComponents extends Record<string, StatusComponent> {}

export type StatusComponentFuncs<C> = {
  [K in keyof StatusComponents]: StatusComponents[K] extends C
    ? (...args: ComponentFuncArgs<StatusComponents[K]>) => boolean
    : never;
};
