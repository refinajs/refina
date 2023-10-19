import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./input.styles";
import { InputAppearance } from "./input.types";

@FluentUI.triggerComponent("fTextInput")
export class FTextInput extends TriggerComponent<string> {
  appearance: InputAppearance = "outline";
  inputEl = ref<HTMLElementComponent<"input">>();
  main(_: ComponentContext<this>, value: D<string>, disabled: D<boolean> = false, placeholder?: D<string>): void {
    const valueValue = getD(value),
      disabledValue = getD(disabled),
      placeholderValue = getD(placeholder);

    styles.root(this.appearance, disabledValue, false)(_);
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
            this.$fire(newValue);
          },
        });
    });
  }
}

@FluentUI.triggerComponent("fUnderlineTextInput")
export class FUnderlineTextInput extends FTextInput {
  appearance: InputAppearance = "underline";
}

declare module "refina" {
  interface TriggerComponents {
    fTextInput: FTextInput;
    fUnderlineTextInput: FUnderlineTextInput;
  }
}
