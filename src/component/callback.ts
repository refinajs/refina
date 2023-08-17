import { ToFullContext, contextFuncs, Context } from "../context";
import { ViewState } from "../view";
import {
  Component,
  ComponentConstructor,
  ComponentContextClass,
  ComponentFuncArgs,
  IntrinsicComponentContext,
} from "./component";

export abstract class CallbackComponent<
  Evs extends Record<string, any>,
> extends Component {
  $status: boolean;
  $listendEvs = new Set<keyof Evs>();
  //@ts-ignore
  abstract main(_: CallbackComponentContext<Evs, this>, ...args: any[]): void;
}
export type CallbackComponentEvs<C extends CallbackComponent<any>> =
  C extends CallbackComponent<infer Evs> ? Evs : never;
interface IntrinsicCallbackComponentContext<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
  C = any,
  Ev = unknown,
> extends IntrinsicComponentContext<S, C, Ev> {
  $firer<Ev extends keyof Evs>(name: Ev): (data: Evs[Ev]) => void;
  $firerWith<Ev extends keyof Evs>(name: Ev, data: Evs[Ev]): () => void;
}
export type CallbackComponentContext<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
  C = any,
  Ev = unknown,
> = ToFullContext<C, Ev, IntrinsicCallbackComponentContext<Evs, S, C, Ev>>;
export class CallbackComponentContextClass<
    Evs extends Record<string, any>,
    S extends CallbackComponent<Evs>,
  >
  extends ComponentContextClass<S>
  implements IntrinsicCallbackComponentContext<Evs, S>
{
  $firer<Evn extends keyof Evs>(name: Evn): (data: Evs[Evn]) => void {
    return (data: Evs[Evn]) => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$view.recv(this.$component.ikey, name);
    };
  }
  $firerWith<Evn extends keyof Evs>(name: Evn, data: Evs[Evn]): () => void {
    return () => {
      //@ts-ignore
      this.$component.$evName = name;
      //@ts-ignore
      this.$component.$ev = data;
      this.$view.recv(this.$component.ikey, name);
    };
  }
}
export function createCallbackComponentFunc<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
>(ctor: ComponentConstructor<S>) {
  return function (this: Context, ckey: string, ...args: any[]) {
    const component = this.beginComponent(ckey, ctor);
    let ret: boolean;
    if (this.$state === ViewState.update) {
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
      this.$hookAfterThisComponent = () => {
        const context = new CallbackComponentContextClass(
          this,
          componentProxy as any
        );

        component.main(
          context as any as CallbackComponentContext<Evs, S>,
          ...args
        );

        if (!context.$classesArgUsed) {
          context.$firstHTMLELement?.addClasses(context.$classesArg);
        }

        context.$callHookAfterThisComponent();
      };
      ret = true;
    } else {
      // this.$state === ViewState.recv

      component.$listendEvs.forEach((ev) => {
        //@ts-ignore
        component[`on${ev[0].toUpperCase()}${ev.slice(1)}`] = () =>
          //@ts-ignore
          component.$evName === ev;
      });

      const context = new CallbackComponentContextClass(this, component as any);

      component.main(
        context as any as CallbackComponentContext<Evs, S>,
        ...args
      );
      ret = this.$view.isReceiver;

      context.$callHookAfterThisComponent();
    }
    this.endComponent(ckey);
    return ret;
  };
}
export function callbackComponent<
  Evs extends Record<string, any>,
  S extends CallbackComponent<Evs>,
>(ctor: ComponentConstructor<S>) {
  if (!ctor.name) throw new Error(`Component class must have name.`);
  const name = ctor.name[0].toLowerCase() + ctor.name.slice(1);
  contextFuncs[name] = createCallbackComponentFunc<Evs, S>(ctor);
  return ctor;
}
export interface CallbackComponents
  extends Record<string, CallbackComponent<any>> {}

type CallbackComponentInContext<C extends CallbackComponent<any>> = C & {
  [Evn in keyof CallbackComponentEvs<C> as `on${Capitalize<
    Evn & string
    //@ts-ignore
  >}`]: () => this is C & {
    $evName: Evn;
    $ev: CallbackComponentEvs<C>[Evn];
  };
};

export type ToCallbackComponentFuncs<
  Cs extends Record<string, CallbackComponent<any>>,
  C,
> = {
  [K in keyof Cs]: Cs[K] extends C
    ? (
        ...args: ComponentFuncArgs<Cs[K]>
        //@ts-ignore
      ) => this is Context<
        CallbackComponentInContext<Cs[K]>,
        keyof CallbackComponentEvs<Cs[K]>
      >
    : never;
};

export type CallbackComponentFuncs<C> = ToCallbackComponentFuncs<
  CallbackComponents,
  C
>;
