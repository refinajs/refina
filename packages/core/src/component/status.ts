import {
  Context,
  CustomContext,
  ToFullContext,
  addCustomContextFunc,
} from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class StatusComponent extends Component {
  $status: boolean;
  abstract main(_: StatusComponentContext<this>, ...args: any[]): void;
}
export class IntrinsicStatusComponentContext<
  S extends StatusComponent,
  C = any,
> extends IntrinsicComponentContext<S, C> {
  get $status() {
    return this.$component.$status;
  }
  set $status(v: boolean) {
    if (this.$component.$status === v) return;
    this.$component.$status = v;
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
}
export type StatusComponentContext<
  S extends StatusComponent,
  C = any,
> = ToFullContext<C, IntrinsicStatusComponentContext<S, C>>;

export function statusComponent<
  N extends keyof StatusComponents | keyof CustomContext<any>,
>(name: N) {
  return <T extends ComponentConstructor<StatusComponent>>(ctor: T) => {
    addCustomContextFunc(
      name,
      function (this: Context, ckey: string, ...args: any[]): any {
        const component = this.$beginComponent(ckey, ctor) as StatusComponent;

        component.$status ??= false;

        const context = new IntrinsicStatusComponentContext(this, component);

        component.main(
          context as any as StatusComponentContext<
            StatusComponent & {
              $status: boolean;
            }
          >,
          ...args,
        );

        if (!context.$classesAndStyleUsed) {
          context.$firstHTMLELement?.addClasses(context.$classesArg);
          context.$firstHTMLELement?.addStyle(context.$styleArg);
        }

        this.$endComponent(ckey);

        return component.$status;
      },
    );
    return ctor;
  };
}

export interface StatusComponents {}

export type StatusComponentFuncs<C> = {
  [K in keyof StatusComponents]: StatusComponents[K] extends C
    ? (...args: ComponentFuncArgs<StatusComponents[K]>) => boolean
    : never;
};
