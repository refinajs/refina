import {
  Context,
  CustomContext,
  ToFullContext,
  contextFuncs,
} from "../context";
import { AppState } from "../app";
import {
  Component,
  ComponentConstructor,
  ComponentFuncArgs,
  IntrinsicComponentContext,
  componentRegister,
} from "./component";

export abstract class CallbackComponent<
  Evs extends Record<string, any>,
> extends Component {
  $status: boolean;
  $listendEvs = new Set<keyof Evs>();
  //@ts-ignore
  abstract main(_: CallbackComponentContext<Evs, this>, ...args: any[]): void;

  $preventDefault(): true {
    const ev = (this as any).$ev;
    if (typeof ev?.preventDefault !== "function") {
      throw new Error(`Cannot prevent default on ${ev}.`);
    }
    ev.preventDefault();
    return true;
  }
}
export type CallbackComponentEvs<C extends CallbackComponent<any>> =
  C extends CallbackComponent<infer Evs> ? Evs : never;
export class IntrinsicCallbackComponentContext<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
  C = any,
> extends IntrinsicComponentContext<S, C> {
  $firer<Evn extends keyof Evs>(name: Evn): (data: Evs[Evn]) => void {
    return (data: Evs[Evn]) => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$app.recv(this.$component.ikey, name);
      return false;
    };
  }
  $firerWith<Evn extends keyof Evs>(name: Evn, data: Evs[Evn]): () => void {
    return () => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$app.recv(this.$component.ikey, name);
    };
  }
}
export type CallbackComponentContext<
  Evs extends Record<string, any>,
  S extends CallbackComponent<any>,
  C = any,
> = ToFullContext<C, IntrinsicCallbackComponentContext<Evs, S, C>>;
export function createCallbackComponentFunc<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
>(ctor: ComponentConstructor<S>) {
  return function (this: Context, ckey: string, ...args: any[]) {
    const component = this.beginComponent(ckey, ctor);
    let ret: boolean;
    if (this.$updating) {
      component.$listendEvs.clear();
      const componentProxy = new Proxy(component, {
        get(target, prop) {
          if (
            typeof prop === "string" &&
            prop.startsWith("on") &&
            prop[2].toUpperCase() === prop[2]
          ) {
            const ev = prop[2].toLocaleLowerCase() + prop.slice(3);
            target.$listendEvs.add(ev);
            return () => false;
          }
          //@ts-ignore
          return target[prop];
        },
      });
      this.$cbComponent = componentProxy;
      this.$app.hookAfterThisComponent = () => {
        const context = new IntrinsicCallbackComponentContext(
          this,
          componentProxy as any,
        );

        component.main(
          context as any as CallbackComponentContext<Evs, S>,
          ...args,
        );

        if (!context.$classesAndStyleUsed) {
          context.$firstHTMLELement?.addClasses(context.$classesArg);
          context.$firstHTMLELement?.addStyle(context.$styleArg);
        }
      };
      ret = true;
    } else {
      // this.$receiving

      component.$listendEvs.forEach((ev) => {
        //@ts-ignore
        component[`on${ev[0].toUpperCase()}${ev.slice(1)}`] = () =>
          //@ts-ignore
          component.$evName === ev;
      });

      const context = new IntrinsicCallbackComponentContext(
        this,
        component as any,
      );

      component.main(
        context as any as CallbackComponentContext<Evs, S>,
        ...args,
      );
      ret = this.$app.isReceiver;
    }
    this.endComponent(ckey);
    return ret;
  };
}
export function callbackComponent<
  N extends keyof CallbackComponents | keyof CustomContext<any>,
>(name: N) {
  return <T extends ComponentConstructor<CallbackComponent<any>>>(ctor: T) => {
    //@ts-ignore
    contextFuncs[name] = createCallbackComponentFunc<
      CallbackComponentEvs<CallbackComponent<any>>,
      CallbackComponent<any>
    >(ctor);
    return ctor;
  };
}

export interface CallbackComponents {}

type CallbackComponentInContext<C extends CallbackComponent<any>> = C & {
  [Evn in keyof CallbackComponentEvs<C> as `on${Capitalize<
    Evn & string
    //@ts-ignore
  >}`]: () => this is C & {
    $evName: Evn;
    $ev: CallbackComponentEvs<C>[Evn];
  };
};

export type ToCallbackComponentFuncs<Cs extends Record<string, any>, C> = {
  [K in keyof Cs]: Cs[K] extends C
    ? (
        ...args: ComponentFuncArgs<Cs[K]>
        //@ts-ignore
      ) => this is {
        readonly $: CallbackComponentInContext<Cs[K]>;
        readonly $ev: keyof CallbackComponentEvs<Cs[K]>;
      }
    : never;
};

export type CallbackComponentFuncs<C> = ToCallbackComponentFuncs<
  CallbackComponents,
  C
>;
