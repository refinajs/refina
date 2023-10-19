import { Context } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class StatusComponent extends Component {
  $_status: boolean = false;
  get $status() {
    return this.$_status;
  }
  set $status(v: boolean) {
    if (this.$_status === v) return;
    this.$_status = v;
    this.$update();
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
  abstract main(_: ComponentContext<this>, ...args: any[]): void;
}

export function createStatusComponentFunc<
  T extends ComponentConstructor<StatusComponent>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as StatusComponent;

    const context = new IntrinsicComponentContext(this, component);

    component.main(
      context as any as ComponentContext<
        StatusComponent & {
          $status: boolean;
        }
      >,
      ...args,
    );

    if (!context.$mainEl) {
      context.$mainEl = context.$firstHTMLELement?.$mainEl ?? null;
      context.$firstHTMLELement?.addClasses(context.$classesArg);
      context.$firstHTMLELement?.addStyle(context.$styleArg);
    }

    component.$mainEl = context.$mainEl;

    this.$endComponent(component, ckey);

    return component.$status;
  };
}

export interface StatusComponents {}

export type StatusComponentFuncs<C> = {
  [K in keyof StatusComponents]: StatusComponents[K] extends C
    ? (...args: ComponentFuncArgs<StatusComponents[K]>) => boolean
    : never;
};
