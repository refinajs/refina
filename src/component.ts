import { D } from "./data";
import { View } from "./view";
import {
  Context,
  ContextClass,
  IntrinsicContext,
  ToFullContext,
  contextFuncs,
} from "./context";

interface IntrinsicComponentContext<S, C = any, Ev = unknown>
  extends IntrinsicContext<C, Ev> {
  readonly $self: S;
  readonly $ikey: string;
  $setD<T>(d: D<T>, v: T): boolean;
  $refresh(): void;

  $cls(): void;
  $cls(classes: string[]): void;
  $cls(strings: TemplateStringsArray, ...exps: any[]): void;
}
export type ComponentContext<S, C = any, Ev = unknown> = ToFullContext<
  C,
  Ev,
  IntrinsicComponentContext<C, Ev>
>;
export class ComponentContextClass<S>
  extends ContextClass
  implements IntrinsicComponentContext<S>
{
  constructor(
    public $view: View,
    public $ikey: string,
    public $self: S,
    classesArg: string[]
  ) {
    super($view);
    this.$classesArg = classesArg;
  }
  $setD<T>(d: D<T>, v: T): boolean {
    return this.$view.setD(d, v);
  }
  $refresh() {
    this.$view.update();
  }

  $classesArg: string[] | null = null;
  $cls(...args: [] | any[]): void {
    if (args.length === 0) {
      if (!this.$classesArg) {
        throw new Error(`Passed $classes has been used.`);
      }
      super.$cls(this.$classesArg);
      this.$classesArg = null;
    }
    super.$cls(...args);
  }
}

interface IntrinsicTriggerComponentContext<S, C = any, Ev = unknown>
  extends IntrinsicComponentContext<S, C, Ev> {
  $fire: (data: any) => void;
  $fireWith: (data: any) => () => void;
}
export type TriggerComponentContext<S, C = any, Ev = unknown> = ToFullContext<
  C,
  Ev,
  IntrinsicTriggerComponentContext<S, C, Ev>
>;
export class TriggerComponentContextClass<S>
  extends ComponentContextClass<S>
  implements IntrinsicTriggerComponentContext<S>
{
  $fire = (data: any) => {
    this.$view.fire(this.$ikey, data);
  };
  $fireWith = (data: any) => () => {
    this.$fire(data);
  };
}
export function defineTrigger<S extends object>(
  ctor: new () => S,
  func: (_: TriggerComponentContext<S>, ...args: any) => void,
  name = func.name
) {
  contextFuncs[name] = function (this: Context, view, ckey, ...args) {
    const { component, ikey } = view.beginComponent(ckey, ctor);

    const context = new TriggerComponentContextClass(
      view,
      ikey,
      component,
      this.$classes
    );

    func(context as any as TriggerComponentContext<S>, ...args);

    const isReceiver = view.isReceiver;

    if (context.$classesArg !== null) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    view.endComponent();

    return isReceiver;
  };
}
export interface TriggerComponents
  extends Record<string, [object, any[], object]> {}

interface IntrinsicStatusComponentContext<
  S extends object & {
    $status: boolean;
  },
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $status: boolean;
  $on(): void;
  $off(): void;
  $toggle(): void;
}
export type StatusComponentContext<
  S extends object & {
    $status: boolean;
  },
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicStatusComponentContext<S, C, Ev>>;
export class StatusComponentContextClass<
    S extends object & {
      $status: boolean;
    },
  >
  extends ComponentContextClass<S>
  implements IntrinsicStatusComponentContext<S>
{
  get $status() {
    return this.$self.$status;
  }
  set $status(v) {
    if (this.$self.$status === v) return;
    this.$self.$status = v;
    this.$refresh();
  }
  $on = () => {
    this.$status = true;
  };
  $off = () => {
    this.$status = false;
  };
  $toggle = () => {
    this.$status = !this.$status;
  };
}
export function defineStatus<
  S extends object & {
    $status?: boolean;
  },
>(
  ctor: new () => S,
  func: (
    _: StatusComponentContext<
      S & {
        $status: boolean;
      }
    >,
    ...args: any
  ) => void,
  name = func.name
) {
  contextFuncs[name] = function (this: Context, view, ckey, ...args) {
    const { component, ikey } = view.beginComponent(ckey, ctor);

    component.$status ??= false;

    const context = new StatusComponentContextClass(
      view,
      ikey,
      component as S & {
        $status: boolean;
      },
      this.$classes
    );

    func(
      context as any as StatusComponentContext<
        S & {
          $status: boolean;
        }
      >,
      ...args
    );

    if (context.$classesArg !== null) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    view.endComponent();

    return component.$status;
  };
}
export interface StatusComponents extends Record<string, [object, any[]]> {}

export type ComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K][0] extends C
    ? (
        ...args: TriggerComponents[K][1]
        //@ts-ignore
      ) => this is Context<TriggerComponents[K][0], TriggerComponents[K][2]>
    : never;
} & {
  [K in keyof StatusComponents]: StatusComponents[K][0] extends C
    ? (...args: StatusComponents[K][1]) => boolean
    : never;
};
