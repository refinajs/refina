import { AppState } from "../constants";
import { Context, CustomContextFuncs, IntrinsicContext } from "../context";
import { D, dangerously_setD } from "../data";
import {
  DOMElementComponent,
  DOMNodeComponent,
  DOMRootComponent,
} from "../dom";

export interface AppRuntimeHookMap {
  afterThisComponent: () => void;
  beforeModifyDOM: () => void;
  afterModifyDOM: () => void;
}

export interface AppPermanentHookMap extends AppRuntimeHookMap {
  beforeMain: () => void;
  afterMain: () => void;
  initializeContext: (context: Context) => void;
}

declare global {
  interface Window {
    __MAIN_EXECUTED_TIMES__: number;
  }
}

export type AppView = (_: Context) => void;

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

  contextFuncs: CustomContextFuncs = {} as any;
  getCustomContextFunc<N extends keyof CustomContextFuncs>(
    name: N,
  ): CustomContextFuncs[N] {
    return this.contextFuncs[name] as any;
  }

  root: DOMRootComponent;
  refMap: Map<string, any> = new Map();
  nodeMap: Map<Node, DOMNodeComponent> = new Map();
  _: Context | undefined;
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

  eventRecevier: string | symbol | null;
  get eventRecevierRef() {
    if (typeof this.eventRecevier === "symbol")
      throw new Error(
        `Cannot get ref of eventRecevier of type symbol: ${String(
          this.eventRecevier,
        )}`,
      );
    return this.refMap.get(this.eventRecevier!);
  }
  eventData: any;

  protected idPrefix: string[];

  state: AppState;

  pendingRootCSS: string;
  pendingRootCls: string[];

  mounted = false;
  running = false;
  recvQueue: { receiver: string | symbol; data: any }[] = [];
  needUpdate = false;
  protected get needNextTickRun() {
    return this.recvQueue.length > 0 || this.needUpdate;
  }

  protected resetState() {
    this.root.children = [];
    this.root.portals = new Set();
    this.currentDOMParent = this.root;
    this.eventRecevier = null;
    this.idPrefix = ["root"];
  }

  mount() {
    if (this.mounted) {
      throw new Error("App already mounted");
    }
    this.execUpdate();
    this.runtimeData = undefined;
    this.callAndResetHook("beforeModifyDOM");
    this.root.createDOM();
    this.callAndResetHook("afterModifyDOM");
    this.mounted = true;
  }
  nextTick() {
    setTimeout(() => {
      console.debug(`[!] next tick`);
      if (this.recvQueue.length > 0) {
        const { receiver, data } = this.recvQueue.shift()!;
        console.debug(
          `[+] recv executing start with id ${String(receiver)}, remaining ${
            this.recvQueue.length
          }`,
        );
        const startTime = window.performance.now();
        this.execRecv(receiver, data);
        this.runtimeData = undefined;
        console.debug(
          `[-] recv executed with id ${String(receiver)} in ${
            window.performance.now() - startTime
          }ms`,
        );
        this.nextTick();
      } else if (this.needUpdate) {
        this.needUpdate = false;
        console.debug(`[+] update executing start`);
        const startTime = window.performance.now();
        this.execUpdate();
        this.callAndResetHook("beforeModifyDOM");
        this.root.updateDOM();
        this.callAndResetHook("afterModifyDOM");
        this.runtimeData = undefined;
        console.debug(
          `[-] update executed in ${window.performance.now() - startTime}ms`,
        );
      }
    }, 0);
  }
  update = () => {
    console.debug(`[*] update queued`);
    this.needUpdate = true;
    if (!this.running) this.nextTick();
  };
  recv = (receiver: string | symbol, data: any) => {
    console.debug(`[*] recv queued with receiver ${String(receiver)}`);
    this.recvQueue.push({ receiver, data });
    this.needUpdate = true;
    if (!this.running) this.nextTick();
  };
  protected execMain() {
    const initialKey = this.ikey;
    try {
      this.running = true;
      this._ = new IntrinsicContext(this) as any;
      this.clearEventListeners();
      this.runtimeData = {};
      this.processedComponents.clear();
      this.callPermanentHook("beforeMain");
      this.main(this._ as Context);
      this.callPermanentHook("afterMain");
      this._ = undefined;

      if (initialKey !== this.ikey) {
        throw new Error(
          `Key mismatch: ${initialKey} !== ${this.ikey}. You may have forgotten to call app.popKey()`,
        );
      }

      if (this.state === AppState.update) {
        for (const ikey of this.noPreserveComponents) {
          if (!this.processedComponents.has(ikey)) {
            this.refMap.delete(ikey);
          }
        }
      }

      window.__MAIN_EXECUTED_TIMES__ ??= 1;
      console.debug(`main executed ${window.__MAIN_EXECUTED_TIMES__++} times`);
    } catch (e) {
      console.error("Error when executing main:", e, "\nstate:", this.state);
    } finally {
      this.running = false;
    }
  }
  protected execRecv(receiver: string | symbol, data: any = null) {
    this.resetState();
    this.state = AppState.recv;
    this.eventRecevier = receiver;
    this.eventData = data;
    this.execMain();
  }
  protected execUpdate() {
    this.resetState();
    this.state = AppState.update;
    this.eventRecevier = null;
    this.eventData = undefined;
    this.pendingRootCSS = "";
    this.pendingRootCls = [];
    this.execMain();
    this.root.setClasses(this.pendingRootCls);
    this.root.setStyle(this.pendingRootCSS);
  }

  runtimeHooks: { [K in keyof AppRuntimeHookMap]?: AppRuntimeHookMap[K][] } =
    {};
  permanentHooks: {
    [K in keyof AppPermanentHookMap]?: AppPermanentHookMap[K][];
  } = {};
  callAndResetHook<K extends keyof AppRuntimeHookMap>(
    hookName: K,
    ...args: Parameters<AppRuntimeHookMap[K]>
  ): ReturnType<AppRuntimeHookMap[K]>[] | null {
    const runtimeHooks = this.runtimeHooks[hookName];
    if (runtimeHooks) {
      this.runtimeHooks[hookName] = undefined;
      //@ts-ignore
      return runtimeHooks.map((hook) => hook(...args));
    }
    const permanentHooks = this.permanentHooks[hookName];
    if (permanentHooks) {
      //@ts-ignore
      return permanentHooks.map((hook) => hook(...args));
    }
    return null;
  }
  callPermanentHook<K extends keyof AppPermanentHookMap>(
    hookName: K,
    ...args: Parameters<AppPermanentHookMap[K]>
  ): ReturnType<AppPermanentHookMap[K]>[] | null {
    const permanentHooks = this.permanentHooks[hookName];
    if (permanentHooks) {
      //@ts-ignore
      return permanentHooks.map((hook) => hook(...args));
    }
    return null;
  }
  pushHook<K extends keyof AppRuntimeHookMap>(
    hookName: K,
    ...hooks: AppRuntimeHookMap[K][]
  ): void {
    this.runtimeHooks[hookName] ??= [];
    this.runtimeHooks[hookName]!.push(...hooks);
  }
  addPermanentHook<K extends keyof AppPermanentHookMap>(
    hookName: K,
    ...hooks: AppPermanentHookMap[K][]
  ): void {
    this.permanentHooks[hookName] ??= [];
    this.permanentHooks[hookName]!.push(...hooks);
  }

  setD = <T>(d: D<T>, v: T): boolean => {
    if (dangerously_setD(d, v)) {
      this.update();
      return true;
    }
    return false;
  };

  pushKey(ckey: string) {
    this.idPrefix.push(ckey);
    return this.ikey;
  }
  popKey(ckey: string, msg?: string) {
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
    return this.eventRecevier === this.ikey;
  }

  protected registeredWindowEventListeners: {
    [K in keyof WindowEventMap]?: [
      listener: (this: Window, ev: WindowEventMap[K]) => any,
      capture: boolean | undefined,
    ][];
  } = {};
  protected registeredDocumentEventListeners: {
    [K in keyof DocumentEventMap]?: [
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      capture: boolean | undefined,
    ][];
  } = {};
  protected registeredRootEventListeners: {
    [K in keyof HTMLElementEventMap]?: [
      listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any,
      capture: boolean | undefined,
    ][];
  } = {};
  clearEventListeners() {
    Object.entries(this.registeredWindowEventListeners).forEach(
      ([type, listeners]) =>
        listeners?.forEach(([listener, capture]) =>
          window.removeEventListener(type, listener as any, capture),
        ),
    );
    Object.entries(this.registeredDocumentEventListeners).forEach(
      ([type, listeners]) =>
        listeners?.forEach(([listener, capture]) =>
          document.removeEventListener(type, listener as any, capture),
        ),
    );
    Object.entries(this.registeredRootEventListeners).forEach(
      ([type, listeners]) =>
        listeners?.forEach(([listener, capture]) =>
          this.root.node.removeEventListener(type, listener as any, capture),
        ),
    );
  }
  registerWindowEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.registeredWindowEventListeners[type] ??= [];
    this.registeredWindowEventListeners[type]!.push([
      listener,
      typeof options === "boolean" ? options : options?.capture,
    ]);
    window.addEventListener(type, listener, options);
  }
  registerDocumentEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.registeredDocumentEventListeners[type] ??= [];
    this.registeredDocumentEventListeners[type]!.push([
      listener,
      typeof options === "boolean" ? options : options?.capture,
    ]);
    document.addEventListener(type, listener, options);
  }
  registerRootEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.registeredRootEventListeners[type] ??= [];
    this.registeredRootEventListeners[type]!.push([
      listener,
      typeof options === "boolean" ? options : options?.capture,
    ]);
    this.root.node.addEventListener(type, listener as any, options);
  }
}
