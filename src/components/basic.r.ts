import { D, getD, ref } from "../data";
import { defineStatus, defineTrigger } from "../component";
import { HTMLElementComponent } from "../dom";

export class Button {}
declare module "../component" {
  interface TriggerComponents {
    button: [Button, [text: D<string>], MouseEvent];
  }
}
defineTrigger(Button, function button(_, text: D<string>) {
  _._button(
    {
      onclick: _.$fire,
    },
    getD(text)
  );
});

export class TextInput {
  inputEl = ref<HTMLElementComponent<"input">>();
}
declare module "../component" {
  interface StatusComponents {
    textInput: [TextInput, [label: D<string>, value: D<string>]];
  }
}
defineStatus(
  TextInput,
  function textInput(_, label: D<string>, value: D<string>) {
    _._label({}, () => {
      _._t(label);
      _.$ref(_.$self.inputEl) &&
        _._input({
          value: getD(value),
          oninput: () => {
            _.$setD(value, _.$self.inputEl.current!.node.value);
          },
          onfocus: _.$on,
          onblur: _.$off,
        });
    });
  }
);
