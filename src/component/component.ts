import { D } from "../data";
import { Context, IntrinsicContext, ToFullContext } from "../context";

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

export class IntrinsicComponentContext<
  S extends Component,
  C = any,
> extends IntrinsicContext<C> {
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

export type ComponentContext<S extends Component, C = any> = ToFullContext<
  C,
  IntrinsicComponentContext<S, C>
>;
