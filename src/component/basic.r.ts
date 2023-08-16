import { D, getD, ref } from "../data";
import {
  CallbackComponent,
  CallbackComponentContext,
  StatusComponent,
  StatusComponentContext,
  TriggerComponent,
  TriggerComponentContext,
  callbackComponent,
  statusComponent,
  triggerComponent,
} from "./index";
import { HTMLElementComponent } from "../dom";

@triggerComponent
export class Button extends TriggerComponent<MouseEvent> {
  main(_: TriggerComponentContext<this>, text: D<string>) {
    _._button(
      {
        onclick: _.$fire,
      },
      getD(text)
    );
  }
}
declare module "./index" {
  interface TriggerComponents {
    button: Button;
  }
}

@statusComponent
export class TextInput extends StatusComponent {
  inputEl = ref<HTMLElementComponent<"input">>();
  main(_: StatusComponentContext<this>, label: D<string>, value: D<string>) {
    _.$component;
    _._label({}, () => {
      _._t(label);
      _.$ref(this.inputEl) &&
        _._input({
          value: getD(value),
          oninput: () => {
            _.$setD(value, this.inputEl.current!.node.value);
          },
          onfocus: _.$on,
          onblur: _.$off,
        });
    });
  }
}
declare module "./index" {
  interface StatusComponents {
    textInput: TextInput;
  }
}

// type Key<E, K extends keyof E> =
//   | ((this: any, ev: any) => any)
//   | null extends E[K]
//   ? K
//   : never;
// type Keys<E> = {
//   [K in keyof E]: Key<E, K>;
// }[keyof E];
// type EvName<K extends string> = K extends `on${infer N}` ? N : never;
// type HTMLELementEvs<E> = {
//   [K in Keys<E> & string as EvName<K>]: E[K] extends ((this: any, ev: infer Ev) => any) | null
//     ? Ev
//     : never;
// };
// type CbButtonEvs = HTMLELementEvs<HTMLButtonElement>;
type CbButtonEvs = HTMLElementEventMap;
@callbackComponent
export class CbButton extends CallbackComponent<CbButtonEvs> {
  main(_: CallbackComponentContext<CbButtonEvs, this>, text: D<string>) {
    _._button(
      Object.fromEntries(
        [...this.$listendEvs].map((ev) => [`on${ev}`, _.$firer(ev)] as const)
      ),
      getD(text)
    );
  }
}
declare module "./index" {
  interface CallbackComponents {
    cbButton: CbButton;
  }
}
