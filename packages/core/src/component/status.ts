import { Context, ContextState } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class StatusComponent<
  Status,
  Props = {},
> extends Component<Props> {
  protected $_status: Status;
  get $status() {
    return this.$_status;
  }
  set $status(v: Status) {
    if (this.$_status === v) return;
    this.$_status = v;
    this.$update();
  }

  abstract main(_: ComponentContext, ...args: any[]): void;
}

export abstract class ToggleComponent<Props = {}> extends StatusComponent<
  boolean,
  Props
> {
  protected $_status = false;

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

export function createStatusComponentFunc<
  T extends ComponentConstructor<StatusComponent<any>>,
>(ctor: T) {
  return function (this: Context, ckey: string, ...args: any[]): any {
    const component = this.$beginComponent(ckey, ctor) as StatusComponent<any>;

    const context = new IntrinsicComponentContext(this);

    component.main(context as any as ComponentContext, ...args);

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

export type StatusComponentFuncs<C extends ContextState> = {
  [K in keyof StatusComponents]: StatusComponents[K] extends C["enabled"]
    ? (...args: ComponentFuncArgs<StatusComponents[K]>) => boolean
    : never;
};
