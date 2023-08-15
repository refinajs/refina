import { D } from "./data";
import { View } from "./view";
import {
  Context,
  ContextClass,
  IntrinsicContext,
  ToFullContext,
  contextFuncs,
} from "./context";

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

interface IntrinsicComponentContext<S extends Component, C = any, Ev = unknown>
  extends IntrinsicContext<C, Ev> {
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
    public $view: View,
    public $component: S,
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

export abstract class TriggerComponent<Ev = unknown> extends Component {
  abstract main(_: TriggerComponentContext<this>, ...args: any[]): void;
}
export type TriggerComponentEventData<S extends TriggerComponent> =
  S extends TriggerComponent<infer Ev> ? Ev : never;
interface IntrinsicTriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $fire: (data: any) => void;
  $fireWith: (data: any) => () => void;
}
export type TriggerComponentContext<
  S extends TriggerComponent,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicTriggerComponentContext<S, C, Ev>>;
export class TriggerComponentContextClass<S extends TriggerComponent>
  extends ComponentContextClass<S>
  implements IntrinsicTriggerComponentContext<S>
{
  $fire = (data: TriggerComponentEventData<S>) => {
    this.$view.fire(this.$component.ikey, data);
  };
  $fireWith = (data: TriggerComponentEventData<S>) => () => {
    this.$fire(data);
  };
}
export function triggerComponent<S extends TriggerComponent>(
  ctor: ComponentConstructor<S>
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);
  contextFuncs[name] = function (this: Context, view, ckey, ...args) {
    const component = view.beginComponent(ckey, ctor);

    const context = new TriggerComponentContextClass(
      view,
      component,
      this.$classes
    );

    component.main(context as unknown as TriggerComponentContext<S>, ...args);

    const isReceiver = view.isReceiver;

    if (context.$classesArg !== null) {
      context.$firstHTMLELement?.addClasses(context.$classesArg);
    }

    view.endComponent();

    return isReceiver;
  };
}
export interface TriggerComponents extends Record<string, TriggerComponent> {}

export abstract class StatusComponent extends Component {
  $status: boolean;
  abstract main(_: StatusComponentContext<this>, ...args: any[]): void;
}
interface IntrinsicStatusComponentContext<
  S extends StatusComponent,
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $status: boolean;
  $on(): void;
  $off(): void;
  $toggle(): void;
}
export type StatusComponentContext<
  S extends StatusComponent,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicStatusComponentContext<S, C, Ev>>;
export class StatusComponentContextClass<S extends StatusComponent>
  extends ComponentContextClass<S>
  implements IntrinsicStatusComponentContext<S>
{
  get $status() {
    return this.$component.$status;
  }
  set $status(v: boolean) {
    if (this.$component.$status === v) return;
    this.$component.$status = v;
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
export function statusComponent<S extends StatusComponent>(
  ctor: ComponentConstructor<S>
) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);
  contextFuncs[name] = function (this: Context, view, ckey, ...args) {
    const component = view.beginComponent(ckey, ctor);

    component.$status ??= false;

    const context = new StatusComponentContextClass(
      view,
      component,
      this.$classes
    );

    component.main(
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
export interface StatusComponents extends Record<string, StatusComponent> {}

export type ComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K] extends C
    ? (
        ...args: ComponentFuncArgs<TriggerComponents[K]>
        //@ts-ignore
      ) => this is Context<
        TriggerComponents[K],
        TriggerComponentEventData<TriggerComponents[K]>
      >
    : never;
} & {
  [K in keyof StatusComponents]: StatusComponents[K] extends C
    ? (...args: ComponentFuncArgs<StatusComponents[K]>) => boolean
    : never;
};
