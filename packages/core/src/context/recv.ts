import { App } from "../app";
import { Component } from "../component";
import { Content, DOMElementComponent } from "../dom";
import {
  ContextFuncs,
  IntrinsicBaseContext,
  RealContextFuncs,
  _,
  initializeBaseContext,
} from "./base";

export interface IntrinsicRecvContext extends IntrinsicBaseContext {
  $lowlevel: IntrinsicRecvContext;

  /**
   * Is the event received?
   */
  $received: boolean;

  /**
   * Process DOM element component in `RECV` state.
   *
   * @param ckey The Ckey of the element.
   * @param content The content of the DOM element component.
   */
  $$processDOMElement(ckey: string, content?: Content): void;
}

/**
 * The full context type in `RECV` state, with context funcs.
 */
export type RecvContext = Readonly<Omit<IntrinsicRecvContext, `$$${string}`>> &
  ContextFuncs;

/**
 * Initialize a context in `RECV` state.
 *
 * @param app The app instance.
 * @param receiver The receiver of the event.
 * @param event The event data.
 */
export function initializeRecvContext(app: App) {
  initializeBaseContext(app);

  const context = _ as unknown as IntrinsicRecvContext;

  context.$updateContext = null;
  context.$recvContext = context as unknown as RecvContext;

  context.$received = false;

  context.$ref =
    context.$props =
    context.$cls =
    context.$css =
    context.$id =
    context.$attrs =
      () => true;

  context.$$assertEmpty = () => {};

  context.$$c = (ckey, funcName, ...args) => {
    if (funcName[0] === "_") {
      if (context.$received) {
        return;
      }

      // The context function is for a HTML or SVG element.
      const [_data, inner, _eventListeners] = args;

      context.$$processDOMElement(ckey, inner as Content | undefined);

      // HTML and SVG element functions do not have a return value.
      return;
    }
    // The context function is for a user-defined component.
    const func = context.$app.contextFuncs[funcName as keyof RealContextFuncs];
    if (import.meta.env.DEV) {
      if (!func) {
        throw new Error(`Unknown element ${funcName}.`);
      }
    }
    // Return the return value of the context function.
    return func.call(context.$lowlevel, ckey, ...args);
  };

  context.$$t = (ckey, content) => {
    // Text node has nothing to receive.
  };

  context.$$processDOMElement = (ckey, content) => {
    if (typeof content === "function") {
      // The content is a view function.

      const el = context.$$currentRefNode[ckey] as
        | DOMElementComponent
        | undefined;

      if (el) {
        const parentRefNode = context.$$currentRefNode;
        context.$$currentRefNode = el.$refTreeNode;

        try {
          content(context._);
        } catch (e) {
          context.$app.callHook("onError", e);
        }

        context.$$currentRefNode = parentRefNode;
      }
    }
    // Text node is ignored in `RECV` state.
  };

  context.$$processComponent = <T extends Component>(
    ckey: string,
    ctor: new () => T,
    args: unknown[],
  ) => {
    let component = context.$$currentRefNode[ckey] as T | undefined;

    const parentRefNode = context.$$currentRefNode;

    if (!component) {
      component = new ctor();
      parentRefNode[ckey] = component;
    }

    context.$$currentRefNode = component.$refTreeNode;

    const ret = component.$main(...args);

    context.$$currentRefNode = parentRefNode;

    return ret;
  };

  app.callHook("initContext", context);
}
