import {
  ComponentConstructor,
  OutputComponent,
  OutputComponents,
  StatusComponent,
  StatusComponents,
  TriggerComponent,
  TriggerComponents,
  createOutputComponentFunc,
  createStatusComponentFunc,
  createTriggerComponentFunc,
} from "../component";
import { ContextFuncs, RealContextFuncs, ToRealContextFunc } from "../context";
import { App } from "./app";

export class Plugin<Args extends any[] = []> {
  constructor(
    public name: string,
    public onInstall: (app: App, ...args: Args) => void = () => {},
  ) {}

  protected contextFuncs: Partial<RealContextFuncs> = {};

  registerFunc<N extends keyof ContextFuncs<any>>(
    name: N,
    func: ToRealContextFunc<N>,
  ) {
    //@ts-ignore
    this.contextFuncs[name] = func;
  }

  outputComponent<N extends keyof OutputComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<OutputComponent>>(ctor: C) => {
      //@ts-ignore
      this.contextFuncs[name] = createOutputComponentFunc(ctor);
      return ctor;
    };
  }

  statusComponent<N extends keyof StatusComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<StatusComponent>>(ctor: C) => {
      //@ts-ignore
      this.contextFuncs[name] = createStatusComponentFunc(ctor);
      return ctor;
    };
  }

  triggerComponent<N extends keyof TriggerComponents | keyof ContextFuncs<any>>(
    name: N,
  ) {
    return <C extends ComponentConstructor<TriggerComponent<any>>>(ctor: C) => {
      //@ts-ignore
      this.contextFuncs[name] = createTriggerComponentFunc(ctor);
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
