import { App } from "../app";
import { Context, IntrinsicContext, ToFullContext } from "../context";
import { DOMNodeComponent, DOMElementComponent } from "../dom";

export abstract class Component {
  constructor(
    public readonly ikey: string,
    public readonly app: App,
  ) {}

  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}
export type ComponentConstructor<S extends Component = Component> = new (
  ikey: string,
  app: App,
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
    super($caller.$app);
    this.$classesArg = $caller.$clsToApply;
    this.$styleArg = $caller.$cssToApply;
    this.$allNoPreserve = $caller.$pendingNoPreserve === "deep";
    $caller.$pendingNoPreserve = false;
  }

  $classesArg: string[];
  $styleArg: string;

  $setFirstDOMNode(node: DOMNodeComponent) {
    super.$setFirstDOMNode(node);
    this.$caller.$setFirstDOMNode(node);
  }
  $setFirstHTMLELement(element: DOMElementComponent) {
    super.$setFirstHTMLELement(element);
    this.$caller.$setFirstHTMLELement(element);
  }

  $classesAndStyleUsed = false;
  $main(): true {
    this.$pendingCls = this.$classesArg;
    this.$pendingCSS = this.$styleArg;
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
