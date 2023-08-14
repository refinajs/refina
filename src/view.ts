import { D, dangerously_setD } from "./data";
import { DOMComponent, HTMLElementComponent } from "./htmlElements";
import { Context, ContextClass } from "./context";

export type ViewRender = (_: Context) => void;

export const viewsSymbolMap = new Map<object, symbol>();

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
  }

  _ = new ContextClass(this) as any as Context;

  protected map: Map<string, any> = new Map();
  root: HTMLElementComponent;

  currrentParent: HTMLElementComponent;
  state: State;
  eventRecevier: string | null;
  eventData: any;
  protected idPrefix: string[];

  protected resetState() {
    this.currrentParent = this.root;
    this.idPrefix = ["root"];
  }

  mount() {
    if (!viewsSymbolMap.has(this.main)) {
      viewsSymbolMap.set(this.main, Symbol(this.main.toString()));
    }
    this.root.createDOM();
    this.update();
  }
  exec(){
    const initialKey = this.ikey;
    this.main(this._);
    if(initialKey!==this.ikey){
      throw new Error(`Key mismatch: ${initialKey} !== ${this.ikey}. You may have forgotten to call view.popKey()`);
    }
  }
  recv(receiver: string, data: any = null) {
    this.resetState();
    this.state = State.recv;
    this.eventRecevier = receiver;
    this.eventData = data;
    this.exec();
  }
  update() {
    this.resetState();
    this.state = State.update;
    this.eventRecevier = null;
    this.eventData = undefined;
    this.exec();
    this.root.updateDOM();
  }

  fire(receiver: string, data: any) {
    console.log("FIRE!", receiver, data);
    this.recv(receiver, data);
    this.update();
  }
  setD<T>(d: D<T>, v: T): boolean {
    const ret = dangerously_setD(d, v);
    this.update();
    return ret;
  }

  beginComponent<T extends object>(ckey: string, proto: T) {
    this.pushKey(ckey);
    const ikey = this.ikey;
    let component = this.map.get(ikey) as T;
    if (!component) {
      component = Object.create(proto);
      this.map.set(ikey, component);
    }
    if (this._.$pendingRef) {
      this._.$pendingRef.current = component;
      this._.$pendingRef = null;
    }
    return { component, ikey };
  }
  endComponent() {
    this.popKey();
    this._.$pendingRef = null;
  }

  renderHTMLElement<E extends keyof HTMLElementTagNameMap>(
    ckey: string,
    tagName: E,
    data: Partial<HTMLElementTagNameMap[E]>,
    inner: ViewRender
  ) {
    this.pushKey(ckey);
    const ikey = this.ikey;
    let ec = this.map.get(ikey) as HTMLElementComponent | undefined;
    const oldParent = this.currrentParent;
    switch (this.state) {
      case State.update:
        if (!ec) {
          ec = new HTMLElementComponent(ikey, document.createElement(tagName));
          this.map.set(ikey, ec);
        }
        for (const key in data) {
          //@ts-ignore
          ec.node[key] = data[key]!;
        }
        this.currrentParent.children.push(ec);
        ec.children = [];
        this.currrentParent = ec;
        inner(this._);
        break;
      case State.recv:
        this.currrentParent = ec!;
        inner(this._);
        break;
    }
    this.currrentParent = oldParent;
    if (this._.$pendingRef) {
      this._.$pendingRef.current = ec!.node;
      this._.$pendingRef = null;
    }
    this.popKey();
  }
  renderText(ckey: string, text: string) {
    this.pushKey(ckey);
    const ikey = this.ikey;
    let t = this.map.get(ikey) as DOMComponent | undefined;
    if (this.state === State.update) {
      if (!t) {
        t = new HTMLElementComponent(ikey, document.createTextNode(text));
        this.map.set(ikey, t);
      }
      this.currrentParent.children.push(t);
      t.node.textContent = text;
    }
    this.popKey();
  }

  pushKey(id: string) {
    this.idPrefix.push(id);
    console.log("pushKey", this.ikey);
  }
  popKey() {
    this.idPrefix.pop();
  }
  get ikey() {
    return this.idPrefix.join(".");
  }
  get isReceiver() {
    return this.eventRecevier === this.ikey;
  }

  // child<E extends Component>(
  //   id: string,
  //   elc: ComponentCtor<E>,
  //   props: Partial<E>
  // ): boolean {
  //   const e = this.getOrCreate(id, elc);
  //   switch (this.status.currentState) {
  //     case State.update:
  //       this.writeProps(e, props);
  //       this.status.currrentParent.children.push(e);
  //       break;
  //     case State.recv:
  //       break;
  //   }
  //   return this.status.eventRecevier === e.id;
  // }
}

export enum State {
  update, // 更新Element的props，若元素不存在则创建
  recv, // 接收消息，不得改变DOM
}

export function view(render: ViewRender, rootElementId: string = "root"): View {
  let currentView = new View(render, rootElementId);
  currentView.mount();
  return currentView;
}
