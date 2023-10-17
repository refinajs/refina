import {
  CallbackComponent,
  CallbackComponentEvs,
  CallbackComponents,
  ComponentConstructor,
  OutputComponent,
  OutputComponents,
  StatusComponent,
  StatusComponents,
  TriggerComponent,
  TriggerComponents,
  createCallbackComponentFunc,
  createOutputComponentFunc,
  createStatusComponentFunc,
  createTriggerComponentFunc,
} from "../component";
import { Context, CustomContextFuncs, CustomContext } from "../context";
import { App } from "./app";

export class Plugin<Args extends any[] = []> {
  constructor(
    public name: string,
    public onInstall: (app: App, ...args: Args) => void = () => {},
  ) {}

  protected contextFuncs: CustomContextFuncs = {} as any;

  register<N extends keyof CustomContextFuncs>(
    name: N,
    func: CustomContextFuncs[N] & ThisType<Context>,
  ) {
    this.contextFuncs[name] = func;
  }

  callbackComponent<
    N extends keyof CallbackComponents | keyof CustomContext<any>,
  >(name: N) {
    return <C extends ComponentConstructor<CallbackComponent<any>>>(
      ctor: C,
    ) => {
      this.register(
        name,
        createCallbackComponentFunc<
          CallbackComponentEvs<CallbackComponent<any>>,
          CallbackComponent<any>
        >(ctor) as any,
      );
      return ctor;
    };
  }

  outputComponent<N extends keyof OutputComponents | keyof CustomContext<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<OutputComponent>>(ctor: C) => {
      this.register(name, createOutputComponentFunc(ctor));
      return ctor;
    };
  }

  statusComponent<N extends keyof StatusComponents | keyof CustomContext<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<StatusComponent>>(ctor: C) => {
      this.register(name, createStatusComponentFunc(ctor));
      return ctor;
    };
  }

  triggerComponent<
    N extends keyof TriggerComponents | keyof CustomContext<any>,
  >(name: N) {
    return <C extends ComponentConstructor<TriggerComponent<any>>>(ctor: C) => {
      this.register(name, createTriggerComponentFunc(ctor));
      return ctor;
    };
  }

  app: App;

  install(app: App, ...args: Args) {
    this.app = app;
    this.onInstall(app, ...args);
    Object.assign(app.contextFuncs, this.contextFuncs);
    console.debug(`plugin ${this.name} installed.`);
  }
}
