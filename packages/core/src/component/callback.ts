import { Context } from "../context";
import {
  Component,
  ComponentConstructor,
  ComponentContext,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class CallbackComponent<
  Evs extends Record<string, any>,
> extends Component {
  $status: boolean;
  $listendEvs = new Set<keyof Evs>();
  abstract main(_: ComponentContext<this>, ...args: any[]): void;

  $preventDefault(): true {
    const ev = (this as any).$ev;
    if (typeof ev?.preventDefault !== "function") {
      throw new Error(`Cannot prevent default on ${ev}.`);
    }
    ev.preventDefault();
    return true;
  }

  protected $firer<Evn extends keyof Evs>(name: Evn): (data: Evs[Evn]) => void {
    return (data: Evs[Evn]) => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$app.recv(this.$ikey, name);
      return false;
    };
  }
  protected $firerWith<Evn extends keyof Evs>(
    name: Evn,
    data: Evs[Evn],
  ): () => void {
    return () => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$app.recv(this.$ikey, name);
    };
  }
}
export type CallbackComponentEvs<C extends CallbackComponent<any>> =
  C extends CallbackComponent<infer Evs> ? Evs : never;

export function createCallbackComponentFunc<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
>(ctor: ComponentConstructor<S>) {
  return function (this: Context, ckey: string, ...args: any[]) {
    const component = this.$beginComponent(ckey, ctor);
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
          return target[prop as keyof S];
        },
      });
      this.$cbComponent = componentProxy;
      this.$app.pushHook("afterThisComponent", () => {
        const context = new IntrinsicComponentContext(
          this,
          componentProxy as any,
        );

        component.main(context as any as ComponentContext<S>, ...args);

        if (!context.$mainEl) {
          context.$mainEl = context.$firstHTMLELement?.$mainEl ?? null;
          context.$firstHTMLELement?.addClasses(context.$classesArg);
          context.$firstHTMLELement?.addStyle(context.$styleArg);
        }

        component.$mainEl = context.$mainEl;
      });
      ret = true;
    } else {
      // this.$receiving

      component.$listendEvs.forEach((ev) => {
        //@ts-ignore
        component[`on${ev[0].toUpperCase()}${ev.slice(1)}`] = () =>
          //@ts-ignore
          component.$evName === ev;
      });

      const context = new IntrinsicComponentContext(this, component as any);

      component.main(context as any as ComponentContext<S>, ...args);
      ret = this.$app.isReceiver;
    }
    this.$endComponent(component, ckey);
    return ret;
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
    ? (...args: ComponentFuncArgs<Cs[K]>) => //@ts-ignore
      this is {
        readonly $: CallbackComponentInContext<Cs[K]>;
        readonly $ev: keyof CallbackComponentEvs<Cs[K]>;
      }
    : never;
};

export type CallbackComponentFuncs<C> = ToCallbackComponentFuncs<
  CallbackComponents,
  C
>;
