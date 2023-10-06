import { AppContext, AppView, IntrinsicAppContext } from "./context";
import { D, dangerously_setD } from "./data/index";
import { DOMElementComponent, DOMNodeComponent, DOMRootComponent } from "./dom";
import { Router } from "./router/router";

export interface AppHookMap {
  afterThisComponent: () => void;
  beforeModifyDOM: () => void;
  afterModifyDOM: () => void;
}

export class App {
  constructor(
    public main: AppView,
    public rootElementId: string,
  ) {
    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      throw new Error(`Root element ${rootElementId} not found`);
    }
    this.root = new DOMRootComponent("_", rootElement);
    this.resetState();
  }

  root: DOMRootComponent;
  refMap: Map<string, any> = new Map();
  nodeMap: Map<Node, DOMNodeComponent> = new Map();
  _: AppContext | undefined;
  router = new Router(this);
  permanentData: Record<symbol, any> = {};
  runtimeData: Record<symbol, any> | undefined;
  noPreserveComponents = new Set<string>();
  protected processedComponents = new Set<string>();

  markComponentProcessed(ikey: string) {
    if (this.processedComponents.has(ikey)) {
      throw new Error(`Component ${ikey} has already been processed`);
    }
    this.processedComponents.add(ikey);
  }

  currentDOMParent: DOMElementComponent;

  eventRecevierIkey: string | null;
  get eventRecevier() {
    return this.refMap.get(this.eventRecevierIkey!);
  }
  eventData: any;

  protected idPrefix: string[];

  state: AppState;

  mounted = false;
  running = false;
  recvQueue: { receiver: string; data: any }[] = [];
  needUpdate = false;
  protected get needNextTickRun() {
    return this.recvQueue.length > 0 || this.needUpdate;
  }

  protected resetState() {
    this.root.children = [];
    this.root.portals = new Set();
    this.currentDOMParent = this.root;
    this.eventRecevierIkey = null;
    this.idPrefix = ["root"];
  }

  mount() {
    if (this.mounted) {
      throw new Error("App already mounted");
    }
    this.execUpdate();
    this.callAndResetHook("beforeModifyDOM");
    this.root.createDOM();
    this.callAndResetHook("afterModifyDOM");
    this.mounted = true;
  }
  nextTick() {
    setTimeout(() => {
      console.log(`[!] next tick`);
      if (this.recvQueue.length > 0) {
        const { receiver, data } = this.recvQueue.shift()!;
        console.log(
          `[+] recv executing start with id ${receiver}, remaining ${this.recvQueue.length}`,
        );
        const startTime = window.performance.now();
        this.execRecv(receiver, data);
        console.log(
          `[-] recv executed with id ${receiver} in ${
            window.performance.now() - startTime
          }ms`,
        );
        this.nextTick();
      } else if (this.needUpdate) {
        this.needUpdate = false;
        console.log(`[+] update executing start`);
        const startTime = window.performance.now();
        this.execUpdate();
        this.callAndResetHook("beforeModifyDOM");
        this.root.updateDOM();
        this.callAndResetHook("afterModifyDOM");
        console.log(
          `[-] update executed in ${window.performance.now() - startTime}ms`,
        );
      }
    }, 0);
  }
  update() {
    if (this.running && this.state === AppState.update) {
      throw new Error("Cannot trigger an update in update state");
    }
    console.log(`[*] update queued`);
    this.needUpdate = true;
    if (!this.running) this.nextTick();
  }
  recv(receiver: string, data: any) {
    if (this.running && this.state === AppState.update) {
      throw new Error("Cannot trigger a recv in update state");
    }
    console.log(`[*] recv queued with receiver ${receiver}`);
    this.recvQueue.push({ receiver, data });
    this.needUpdate = true;
    if (!this.running) this.nextTick();
  }
  protected execMain() {
    const initialKey = this.ikey;
    try {
      this.running = true;
      this._ = new IntrinsicAppContext(this) as any;
      this.runtimeData = {};
      this.processedComponents.clear();
      this.main(this._ as AppContext);
      this._ = undefined;
      this.runtimeData = undefined;

      if (initialKey !== this.ikey) {
        throw new Error(
          `Key mismatch: ${initialKey} !== ${this.ikey}. You may have forgotten to call app.popKey()`,
        );
      }

      for (const ikey of this.noPreserveComponents) {
        if (!this.processedComponents.has(ikey)) {
          this.refMap.delete(ikey);
        }
      }

      //@ts-ignore
      window["__main_executed_times"] ??= 1;
      //@ts-ignore
      console.log(`main executed ${window["__main_executed_times"]++} times`);
    } catch (e) {
      console.error("Error when executing main:", e, "\nstate:", this.state);
    } finally {
      this.running = false;
    }
  }
  protected execRecv(receiver: string, data: any = null) {
    this.resetState();
    this.state = AppState.recv;
    this.eventRecevierIkey = receiver;
    this.eventData = data;
    this.execMain();
  }
  protected execUpdate() {
    this.resetState();
    this.state = AppState.update;
    this.eventRecevierIkey = null;
    this.eventData = undefined;
    this.execMain();
  }

  hooks: { [K in keyof AppHookMap]?: AppHookMap[K][] } = {};
  callAndResetHook<K extends keyof AppHookMap>(
    hookName: K,
    ...args: Parameters<AppHookMap[K]>
  ): ReturnType<AppHookMap[K]>[] | null {
    const hookList = this.hooks[hookName];
    if (hookList) {
      this.hooks[hookName] = undefined;
      //@ts-ignore
      return hookList.map((hook) => hook(...args));
    }
    return null;
  }
  pushHook<K extends keyof AppHookMap>(
    hookName: K,
    ...hooks: AppHookMap[K][]
  ): void {
    this.hooks[hookName] ??= [];
    this.hooks[hookName]!.push(...hooks);
  }

  setD<T>(d: D<T>, v: T): boolean {
    const ret = dangerously_setD(d, v);
    this.update();
    return ret;
  }

  pushKey(ckey: string) {
    this.idPrefix.push(ckey);
    // console.log("push" + "  ".repeat(this.idPrefix.length), ckey);
  }
  popKey(ckey: string, msg: string = "unknown") {
    // console.log("pop " + "  ".repeat(this.idPrefix.length), ckey, new Error());
    const last = this.idPrefix.pop();
    if (ckey !== last) {
      throw new Error(
        `idPrefix tag mismatch: want to pop "${ckey}", but the last is "${last}".\n
current: ${this.ikey}
message: ${msg}`,
      );
    }
  }
  get ikey() {
    return this.idPrefix.join(".");
  }
  get isReceiver() {
    return this.eventRecevierIkey === this.ikey;
  }
}

export enum AppState {
  update = "update", // 更新Element的props，若元素不存在则创建
  recv = "recv", // 接收消息，不得改变DOM
}

export function app(view: AppView, rootElementId: string = "root") {
  const $app = new App(view, rootElementId);
  $app.mount();
  return $app;
}
