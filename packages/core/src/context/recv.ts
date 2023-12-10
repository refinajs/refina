import type { AppRecvState, RunningApp } from "../app";
import { Component, ComponentConstructor } from "../component";
import { D, Ref, getD } from "../data";
import { Content, DOMElementComponent } from "../dom";
import {
  Context,
  ContextFuncs,
  ContextState,
  EnabledProps,
  InitialContextState,
  IntrinsicContext,
  RealContextFuncs,
} from "./base";

export class IntrinsicRecvContext<
  CS extends ContextState,
> extends IntrinsicContext<CS> {
  constructor($app: RunningApp) {
    super($app);
    this.$recvState = this.$state;
    //@ts-ignore
    this.$ev = this.$state.event;
  }

  declare readonly $state: AppRecvState;

  readonly _: RecvContext = this as unknown as RecvContext;

  readonly $updateState: null = null;

  readonly $recvState: AppRecvState;

  readonly $updateContext: null = null;

  readonly $recvContext: RecvContext<CS> = this as unknown as RecvContext<CS>;

  $ref<C2 extends CS["enabled"]>(
    ref: Ref<C2>,
    ...refs: Ref<C2>[]
  ): this is Context<{
    mode: "fill";
    enabled: C2;
  }> {
    return true;
  }

  $prop<K extends keyof EnabledProps<CS>, V extends EnabledProps<CS>[K]>(
    key: K,
    value: V,
  ): true {
    return true;
  }

  $props<Props extends EnabledProps<CS>>(props: Props): true {
    return true;
  }

  $cls(...args: any[]): true {
    return true;
  }

  $css(...args: any[]): true {
    return true;
  }

  $$assertEmpty() {}

  $$(funcName: string, ckey: string, ...args: any[]): any {
    if (this.$state.received) {
      return;
    }
    if (funcName[0] === "_") {
      // The context function is for a HTML or SVG element.
      const [_data, inner, _eventListeners] = args;

      this.$$processDOMElement(ckey, inner);

      // HTML and SVG element functions do not have a return value.
      return;
    }
    // The context function is for a user-defined component.
    const func = this.$app.contextFuncs[funcName as keyof RealContextFuncs];
    if (import.meta.env.DEV) {
      if (!func) {
        throw new Error(`Unknown element ${funcName}.`);
      }
    }
    // Return the return value of the context function.
    return func.call(this._, ckey, ...args);
  }

  $$t(ckey: string, content: D<string | number | boolean>): void {
    // Text node has nothing to receive.
  }

  $$processComponent<T extends Component>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    args: any[],
  ): T {
    let component = this.$state.currentRefTreeNode[ckey] as T | undefined;

    if (!component) {
      component = new ctor(this.$app);
      this.$state.currentRefTreeNode[ckey] = component;
    } else {
      const parentRefTreeNode = this.$state.currentRefTreeNode;
      this.$state.currentRefTreeNode = component.$refTreeNode;

      // New created component has nothing to receive.
      component.main(this._, ...args);

      this.$state.currentRefTreeNode = parentRefTreeNode;
    }

    return component;
  }

  /**
   * Process DOM element component in `RECV` state.
   *
   * @param ckey The Ckey of the element.
   * @param content The content of the DOM element component.
   */
  $$processDOMElement(ckey: string, content?: D<Content>) {
    const contentValue = getD(content);
    if (typeof contentValue === "function") {
      // The content is a view function.

      const el = this.$state.currentRefTreeNode[ckey] as
        | DOMElementComponent
        | undefined;

      if (el) {
        const parentRefTreeNode = this.$state.currentRefTreeNode;
        this.$state.currentRefTreeNode = el.$refTreeNode;

        try {
          contentValue(this._);
        } catch (e) {
          this.$app.callHook("onError", e);
        }

        this.$state.currentRefTreeNode = parentRefTreeNode;
      }
    }
    // Text node is ignored in `RECV` state.
  }
}

/**
 * The full context type in `RECV` state, with context funcs.
 */
export type RecvContext<CS extends ContextState = InitialContextState> =
  IntrinsicRecvContext<CS> & ContextFuncs<CS>;
