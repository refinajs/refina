import { Context, CustomContext, ToFullContext } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class OutputComponent extends Component {
  abstract main(_: OutputComponentContext<this>, ...args: any[]): void;
}
export class IntrinsicOutputComponentContext<
  S extends OutputComponent,
  C = any,
> extends IntrinsicComponentContext<S, C> {}
export type OutputComponentContext<
  S extends OutputComponent,
  C = any,
> = ToFullContext<C, IntrinsicOutputComponentContext<S, C>>;

export function createOutputComponentFunc<
  T extends ComponentConstructor<OutputComponent>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as OutputComponent;

    const context = new IntrinsicOutputComponentContext(this, component);

    component.main(
      context as any as OutputComponentContext<OutputComponent>,
      ...args,
    );

    if (!context.$mainEl) {
      context.$mainEl = context.$firstHTMLELement?.$mainEl ?? null;
      context.$firstHTMLELement?.addClasses(context.$classesArg);
      context.$firstHTMLELement?.addStyle(context.$styleArg);
    }

    component.$mainEl = context.$mainEl;

    this.$endComponent(component, ckey);

    return;
  };
}

export interface OutputComponents {}

export type OutputComponentFuncs<C> = {
  [K in keyof OutputComponents]: OutputComponents[K] extends C
    ? (...args: ComponentFuncArgs<OutputComponents[K]>) => void
    : never;
};
