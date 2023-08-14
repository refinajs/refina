import { D } from "./data";
import { View } from "./view";
import {
  ContextClass,
  IntrinsicContext,
  ToFullContext,
  contextFuncs,
} from "./context";

interface IntrinsicComponentContext<S, C = any, Ev = unknown>
  extends IntrinsicContext<C, Ev> {
  $self: S;
  /**
   * (ikey)
   */
  $id: string;
  $setD<T>(d: D<T>, v: T): boolean;
  $refresh(): void;
}
export type ComponentContext<S, C = any, Ev = unknown> = ToFullContext<
  C,
  Ev,
  IntrinsicComponentContext<C, Ev>
>;
export class ComponentContextClass<S>
  extends ContextClass
  implements Partial<IntrinsicComponentContext<S>>
{
  constructor(
    public $view: View,
    public $id: string,
    public $self: S
  ) {
    super($view);
  }
  $setD<T>(d: D<T>, v: T): boolean {
    return this.$view.setD(d, v);
  }
  $refresh() {
    this.$view.update();
  }
}

interface IntrinsicTriggerComponentContext<S, C = any, Ev = unknown>
  extends IntrinsicComponentContext<S, C, Ev> {
  $fire: (data: any) => void;
}
export type TriggerComponentContext<S, C = any, Ev = unknown> = ToFullContext<
  C,
  Ev,
  IntrinsicTriggerComponentContext<S, C, Ev>
>;
export class TriggerComponentContextClass<S>
  extends ComponentContextClass<S>
  implements Partial<IntrinsicTriggerComponentContext<S>>
{
  $fire = (data: any) => {
    this.$view.fire(this.$id, data);
  };
}
export function defineTrigger<S extends object>(
  proto: S,
  func: (_: TriggerComponentContext<S>, ...args: any) => void,
  name = func.name
) {
  contextFuncs[name] = function (view, ckey, ...args) {
    const { component, ikey } = view.beginComponent(ckey, proto);

    const context = new ComponentContextClass(view, ikey, component);
    func(context as any as TriggerComponentContext<S>, ...args);
    const isReceiver = view.isReceiver;

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
  implements Partial<IntrinsicStatusComponentContext<S>>
{
  get $status() {
    return this.$self.$status;
  }
  set $status(v) {
    this.$self.$status = v;
    this.$refresh();
  }
  $on = () => {
    this.$status = true;
  };
  $off = () => {
    this.$status = false;
  };
}
export function defineStatus<
  S extends object & {
    $status?: boolean;
  },
>(
  proto: S,
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
  contextFuncs[name] = function (view, ckey, ...args) {
    proto.$status ??= false;

    const { component, ikey } = view.beginComponent(
      ckey,
      proto as S & {
        $status: boolean;
      }
    );

    const context = new StatusComponentContextClass(view, ikey, component);
    func(
      context as any as StatusComponentContext<
        S & {
          $status: boolean;
        }
      >,
      ...args
    );

    view.endComponent();

    return component.$status;
  };
}
export interface StatusComponents extends Record<string, [object, any[]]> {}

// interface IntrinsicHelperComponentContext<S, C = any, Ev = unknown>
//   extends IntrinsicComponentContext<S, C, Ev> {
//   $firer: (data: any) => any;
// }
// export type TriggerComponentContext<S, C = any, Ev = unknown> = ToFullContext<
//   C,
//   Ev,
//   IntrinsicTriggerComponentContext<S, C, Ev>
// >;
// export class TriggerComponentContextClass<S>
//   extends ComponentContextClass<S>
//   implements Partial<IntrinsicTriggerComponentContext<S>>
// {
//   $firer = (data: any) => {
//     this.$view.fire(this.$id, data);
//   };
// }
// export function defineTrigger<S extends object>(
//   proto: S,
//   func: (_: TriggerComponentContext<S>, ...args: any) => void,
//   name = func.name
// ) {
//   components[name] = function (view, ckey, ...args) {
//     const { component, ikey } = view.beginComponent(ckey, proto);

//     const context = new ComponentContextClass(view, ikey, component);
//     func(context as any as TriggerComponentContext<S>, ...args);
//     const isReceiver = view.isReceiver;

//     view.endComponent();

//     return isReceiver;
//   };
// }
// export interface TriggerComponents
//   extends Record<string, [object, any[], object]> {}

export type ComponentFuncs<C> = {
  [K in keyof TriggerComponents]: TriggerComponents[K][0] extends C
    ? (
        ...args: TriggerComponents[K][1]
        //@ts-ignore
      ) => this is Context<TriggerComponents[K][0], TriggerComponents[K][2]>
    : never;
} & {
  [K in keyof StatusComponents]: StatusComponents[K][0] extends C
    ? (
        ...args: StatusComponents[K][1]
        //@ts-ignore
      ) => this is Context<StatusComponents[K][0]>
    : never;
};
