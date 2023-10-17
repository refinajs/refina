import { Context } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class OutputComponent extends Component {
  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}

export function createOutputComponentFunc<
  T extends ComponentConstructor<OutputComponent>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as OutputComponent;

    const context = new IntrinsicComponentContext(this, component);

    component.main(
      context as any as ComponentContext<OutputComponent>,
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
