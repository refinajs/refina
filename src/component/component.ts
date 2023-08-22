import { Context, IntrinsicContext, ToFullContext } from "../context";
import { D } from "../data";
import { DOMNodeComponent, HTMLElementComponent } from "../dom";

export abstract class Component {
  constructor(public readonly ikey: string) {}

  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}
export type ComponentConstructor<S extends Component = Component> = new (
  ikey: string,
) => S;
export type ComponentFuncArgs<S extends Component> = S extends {
  main(_: any, ...args: infer A): void;
}
  ? A
  : never;

export class IntrinsicComponentContext<
  S extends Component,
  C = any,
> extends IntrinsicContext<C> {
  constructor(
    public $caller: Context,
    public $component: S,
  ) {
    super($caller.$view);
    this.$classesArg = $caller.$classes;
    this.$styleArg = $caller.$style;
    //@ts-ignore
    this.$allNoPreserve = $caller.$pendingNoPreserve === "deep";
    //@ts-ignore
    $caller.$pendingNoPreserve = false;
  }

  $classesArg: string[];
  $styleArg: string;

  $setFirstDOMNode(node: DOMNodeComponent) {
    super.$setFirstDOMNode(node);
    this.$caller.$setFirstDOMNode(node);
  }
  $setFirstHTMLELement(element: HTMLElementComponent) {
    super.$setFirstHTMLELement(element);
    this.$caller.$setFirstHTMLELement(element);
  }

  $setD<T>(d: D<T>, v: T): boolean {
    return this.$view.setD(d, v);
  }

  $classesAndStyleUsed = false;
  $main(): true {
    this.$pendingClasses = this.$classesArg;
    this.$pendingStyle = this.$styleArg;
    this.$classesAndStyleUsed = true;
    return true;
  }
}

export type ComponentContext<S extends Component, C = any> = ToFullContext<
  C,
  IntrinsicComponentContext<S, C>
>;

export function componentRegister<F>(func: any): (name: string) => F {
  return ((name: string) => {
    return (ctor: ComponentConstructor) => {
      return func(ctor, name);
    };
  }) as any;
}
