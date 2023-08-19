import { Context, ToFullContext, contextFuncs } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
  componentRegister,
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

export function outputComponent<N extends keyof OutputComponents>(name: N) {
  return (ctor: ComponentConstructor<OutputComponents[N]>) => {
    contextFuncs[name] = function (this: Context, ckey, ...args) {
      const component = this.beginComponent(ckey, ctor);

      const context = new IntrinsicOutputComponentContext(this, component);

      component.main(
        context as any as OutputComponentContext<OutputComponents[N]>,
        ...args,
      );

      if (!context.$classesAndStyleUsed) {
        context.$firstHTMLELement?.addClasses(context.$classesArg);
        context.$firstHTMLELement?.addStyle(context.$styleArg);
      }

      this.endComponent(ckey);

      return;
    };
    return ctor;
  };
}

export interface OutputComponents extends Record<string, OutputComponent> {}

export type OutputComponentFuncs<C> = {
  [K in keyof OutputComponents]: OutputComponents[K] extends C
    ? (...args: ComponentFuncArgs<OutputComponents[K]>) => void
    : never;
};