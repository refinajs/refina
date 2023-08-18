import { Context, ToFullContext, contextFuncs } from "../context";
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
export function outputComponent<S extends OutputComponent>(
  ctor: ComponentConstructor<S>,
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);
  contextFuncs[name] = function (this: Context, ckey, ...args) {
    const component = this.beginComponent(ckey, ctor);

    const context = new IntrinsicOutputComponentContext(this, component);

    component.main(context as any as OutputComponentContext<S>, ...args);

    if (!context.$classesArgUsed) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    this.endComponent(ckey);

    return;
  };
  return ctor;
}
export interface OutputComponents extends Record<string, OutputComponent> {}

export type OutputComponentFuncs<C> = {
  [K in keyof OutputComponents]: OutputComponents[K] extends C
    ? (...args: ComponentFuncArgs<OutputComponents[K]>) => void
    : never;
};
