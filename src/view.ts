import { D, dangerously_setD } from "./data";
import { DOMNodeComponent, HTMLElementComponent } from "./dom";
import { Context, ContextClass } from "./context";
import { Component, ComponentConstructor } from "./component/index";

export type ViewRender = (_: Context) => void;

export class View {
  constructor(
    public main: ViewRender,
    public rootElementId: string
  ) {
    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      throw new Error(`Root element ${rootElementId} not found`);
    }
    this.root = new HTMLElementComponent("~", rootElement);
    this.resetState();
  }

  _ = new ContextClass(this) as any as Context;

  map: Map<string, any> = new Map();
  root: HTMLElementComponent;

  currrentParent: HTMLElementComponent;
  state: ViewState;
  eventRecevierIkey: string | null;
  get eventRecevier() {
    return this.map.get(this.eventRecevierIkey!);
  }
  eventData: any;
  protected idPrefix: string[];

  protected resetState() {
    this.root.children = [];
    this.currrentParent = this.root;
    this.eventRecevierIkey = null;
    this.idPrefix = ["root"];
  }

  mount() {
    this.execUpdate();
    this.root.createDOM();
  }
  update() {
    this.execUpdate();
    this.root.updateDOM();
  }
  execMain() {
    const initialKey = this.ikey;
    try {
      this.main(this._);
    } catch (e) {
      console.error("Error when executing main:", e, "\nstate:", this.state);
    }
    if (initialKey !== this.ikey) {
      throw new Error(
        `Key mismatch: ${initialKey} !== ${this.ikey}. You may have forgotten to call view.popKey()`
      );
    }
  }
  execRecv(receiver: string, data: any = null) {
    this.resetState();
    this.state = ViewState.recv;
    this.eventRecevierIkey = receiver;
    this.eventData = data;
    this.execMain();
  }
  execUpdate() {
    this.resetState();
    this.state = ViewState.update;
    this.eventRecevierIkey = null;
    this.eventData = undefined;
    this.execMain();
  }

  fire(receiver: string, data: any) {
    console.log("FIRE!", receiver, data);
    this.execRecv(receiver, data);
    this.update();
  }
  setD<T>(d: D<T>, v: T): boolean {
    const ret = dangerously_setD(d, v);
    this.update();
    return ret;
  }

  pushKey(id: string) {
    this.idPrefix.push(id);
    //  console.log("pushKey", this.ikey);
  }
  popKey() {
    this.idPrefix.pop();
  }
  get ikey() {
    return this.idPrefix.join(".");
  }
  get isReceiver() {
    return this.eventRecevierIkey === this.ikey;
  }
}

export enum ViewState {
  update = "update", // 更新Element的props，若元素不存在则创建
  recv = "recv", // 接收消息，不得改变DOM
}

export function view(render: ViewRender, rootElementId: string = "root") {
  let currentView = new View(render, rootElementId);
  currentView.mount();
  return currentView;
}
