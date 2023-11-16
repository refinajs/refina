import { App } from "../app";
import {
  Context,
  ContextState,
  IntrinsicContext,
  ToFullContext,
} from "../context";
import { DOMElementComponent, DOMNodeComponent } from "../dom";

export abstract class Component {
  constructor(
    public readonly $ikey: string,
    public readonly $app: App,
  ) {}

  $mainEl: HTMLElement | null;

  $props = {};

  $update() {
    this.$app.update();
  }

  abstract main(_: ComponentContext, ...args: any[]): void;
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
  C extends ContextState,
> extends IntrinsicContext<C> {
  constructor(public $caller: Context) {
    super($caller.$app);
    this.$classesArg = $caller.$clsToApply;
    this.$styleArg = $caller.$cssToApply;
    this.$allNoPreserve = $caller.$nextNoPreserve === "deep";
    $caller.$nextNoPreserve = false;
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
    this.$nextCls = this.$classesArg;
    this.$nextCSS = this.$styleArg;
    return super.$main();
  }
}

export type ComponentContext<C extends ContextState = ContextState> =
  ToFullContext<IntrinsicComponentContext<C>, C>;
