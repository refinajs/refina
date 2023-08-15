import { D, getD, ref } from "../data";
import {
  StatusComponent,
  StatusComponentContext,
  TriggerComponent,
  TriggerComponentContext,
  statusComponent,
  triggerComponent,
} from "../component";
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
declare module "../component" {
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
declare module "../component" {
  interface StatusComponents {
    textInput: TextInput;
  }
}
