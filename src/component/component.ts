import { D } from "../data";
import { View } from "../view";
import {
  Context,
  ContextClass,
  IntrinsicContext,
  ToFullContext,
} from "../context";

export abstract class Component {
  constructor(public readonly ikey: string) {}

  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}
export type ComponentConstructor<S extends Component = Component> = new (
  ikey: string
) => S;
export type ComponentFuncArgs<S extends Component> = S extends {
  main(_: any, ...args: infer A): void;
}
  ? A
  : never;
export interface IntrinsicComponentContext<
  S extends Component,
  C = any,
  Ev = unknown,
> extends IntrinsicContext<C, Ev> {
  readonly $component: S;
  $setD<T>(d: D<T>, v: T): boolean;
  $refresh(): void;

  $cls(): void;
  $cls(classes: string[]): void;
  $cls(strings: TemplateStringsArray, ...exps: any[]): void;
}
export type ComponentContext<
  S extends Component,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicComponentContext<S, C, Ev>>;
export class ComponentContextClass<S extends Component>
  extends ContextClass
  implements IntrinsicComponentContext<S>
{
  constructor(
    public $caller: Context,
    public $component: S
  ) {
    super($caller.$view);
    this.$classesArg = $caller.$classes;
  }
  $classesArg: string[];
  $setD<T>(d: D<T>, v: T): boolean {
    return this.$view.setD(d, v);
  }
  $refresh() {
    this.$view.update();
  }

  $classesArgUsed = false;
  $cls(...args: [] | any[]): void {
    if (args.length === 0) {
      super.$cls(this.$classesArg);
      this.$classesArgUsed = true;
    }
    super.$cls(...args);
  }
}
