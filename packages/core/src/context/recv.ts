import { App } from "../app";
import {
  Component,
  ComponentConstructor,
  ComponentMainFunc,
} from "../component";
import { D, getD } from "../data";
import { Content, DOMElementComponent } from "../dom";
import {
  Context,
  ContextFuncs,
  ContextState,
  InitialContextState,
  IntrinsicBaseContext,
  RealContextFuncs,
  initializeBaseContext,
} from "./base";
export interface IntrinsicRecvContext<
  CS extends ContextState = InitialContextState,
> extends IntrinsicBaseContext<CS> {
  /**
   * The receiver of the event.
   */
  $receiver: unknown;

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
  $$processDOMElement(ckey: string, content?: D<Content>): void;
}

/**
 * The full context type in `RECV` state, with context funcs.
 */
export type RecvContext<CS extends ContextState = InitialContextState> =
  Readonly<Omit<IntrinsicRecvContext<CS>, `$$${string}`>> & ContextFuncs<CS>;

/**
 * Initialize a context in `RECV` state.
 * @param context The context to initialize.
 * @param app The app instance.
 * @param receiver The receiver of the event.
 * @param event The event data.
 */
export function initializeRecvContext(
  context: IntrinsicRecvContext,
  app: App,
  receiver: unknown,
  event: unknown,
) {
  initializeBaseContext(context, app);

  context.$updateContext = null;
  context.$recvContext = context as unknown as RecvContext;

  context.$receiver = receiver;
  //@ts-ignore
  context.$ev = event;
  context.$received = false;

  context.$ref =
    context.$prop =
    context.$props =
    context.$cls =
    context.$css =
      () => true;

  context.$$assertEmpty = () => {};

  context.$$ = function (funcName, ckey, ...args) {
    if (funcName[0] === "_") {
      if (this.$received) {
        return;
      }

      // The context function is for a HTML or SVG element.
      const [_data, inner, _eventListeners] = args;

      context.$$processDOMElement(ckey, inner as D<Content> | undefined);

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
  };

  context.$$t = (ckey, content) => {
    // Text node has nothing to receive.
  };

  context.$$processDOMElement = (ckey: string, content?: D<Content>) => {
    const contentValue = getD(content);
    if (typeof contentValue === "function") {
      // The content is a view function.

      const el = context.$$currentRefTreeNode[ckey] as
        | DOMElementComponent
        | undefined;

      if (el) {
        const parentRefTreeNode = context.$$currentRefTreeNode;
        context.$$currentRefTreeNode = el.$refTreeNode;

        try {
          contentValue(context._);
        } catch (e) {
          context.$app.callHook("onError", e);
        }

        context.$$currentRefTreeNode = parentRefTreeNode;
      }
    }
    // Text node is ignored in `RECV` state.
  };

  context.$$processComponent = function <T extends Component<any>>(
    ckey: string,
    ctor: ComponentConstructor<T>,
    factory: (this: T, context: Context) => ComponentMainFunc,
    args: unknown[],
  ) {
    let component = this.$$currentRefTreeNode[ckey] as T | undefined;

    if (!component) {
      component = new ctor(this.$app);
      component.main = factory.call(component, this._);
      this.$$currentRefTreeNode[ckey] = component;
    } else {
      const parentRefTreeNode = this.$$currentRefTreeNode;
      this.$$currentRefTreeNode = component.$refTreeNode;

      // New created component has nothing to receive.
      component.main(...args);

      this.$$currentRefTreeNode = parentRefTreeNode;
    }

    return component;
  };
}
