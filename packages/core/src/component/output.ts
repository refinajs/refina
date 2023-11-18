import { Context, ContextState } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class OutputComponent<Props = {}> extends Component<Props> {
  abstract main(_: ComponentContext, ...args: any[]): void;
}

export function createOutputComponentFunc<
  T extends ComponentConstructor<OutputComponent>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as OutputComponent;

    const context = new IntrinsicComponentContext(this);

    component.main(context as any as ComponentContext, ...args);

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

export type OutputComponentFuncs<C extends ContextState> = {
  [K in keyof OutputComponents]: OutputComponents[K] extends C["enabled"]
    ? (...args: ComponentFuncArgs<OutputComponents[K]>) => void
    : never;
};
