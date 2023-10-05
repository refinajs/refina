import {
  D,
  HTMLElementComponent,
  TriggerComponent,
  TriggerComponentContext,
  getD,
  ref,
  triggerComponent,
} from "refina";
import styles from "./fInput.styles";

@triggerComponent("fTextInput")
export class FTextInput extends TriggerComponent<string> {
  inputEl = ref<HTMLElementComponent<"input">>();
  main(
    _: TriggerComponentContext<string, this>,
    value: D<string>,
    disabled: D<boolean> = false,
    placeholder?: D<string>,
  ): void {
    const valueValue = getD(value),
      disabledValue = getD(disabled),
      placeholderValue = getD(placeholder);

    styles.root(disabledValue, false)(_);
    _._span({}, () => {
      styles.input(disabledValue)(_);
      _.$ref(this.inputEl) &&
        _._input({
          type: "text",
          value: valueValue,
          disabled: disabledValue,
          placeholder: placeholderValue,
          oninput: () => {
            const newValue = this.inputEl.current!.node.value;
            _.$setD(value, newValue);
            _.$fire(newValue);
          },
        });
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    fTextInput: FTextInput;
  }
}
