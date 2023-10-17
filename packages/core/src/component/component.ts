import { App } from "../app";
import { Context, IntrinsicContext, ToFullContext } from "../context";
import { DOMElementComponent, DOMNodeComponent } from "../dom";

export abstract class Component {
  constructor(
    public readonly $ikey: string,
    public readonly $app: App,
  ) {}

  $mainEl: HTMLElement | null;

  $update() {
    this.$app.update();
  }

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

  $main(): true {
    this.$pendingCls = this.$classesArg;
    this.$pendingCSS = this.$styleArg;
    return super.$main();
  }
}

export type ComponentContext<S extends Component, C = any> = ToFullContext<
  C,
  IntrinsicComponentContext<S, C>
>;
