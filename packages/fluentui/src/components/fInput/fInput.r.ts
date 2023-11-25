import {
  ComponentContext,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import styles from "./input.styles";
import { InputAppearance } from "./input.types";

export abstract class FInput<T> extends TriggerComponent<T> {
  abstract type: string;
  stringifier = (v: T) => String(v);
  abstract parseValue(v: string): T;

  appearance: InputAppearance = "outline";
  inputRef = ref<HTMLElementComponent<"input">>();
  main(
    _: ComponentContext,
    value: D<T>,
    disabled: D<boolean> = false,
    placeholder: D<string> = "",
  ): void {
    const valueValue = getD(value),
      disabledValue = getD(disabled),
      placeholderValue = getD(placeholder);

    styles.root(this.appearance, disabledValue, false)(_);
    _._span(
      {
        onclick: () => {
          this.inputRef.current?.node.focus();
        },
      },
      _ => {
        styles.input(disabledValue)(_);
        _.$ref(this.inputRef) &&
          _._input({
            type: "text",
            value: this.stringifier(valueValue),
            disabled: disabledValue,
            placeholder: placeholderValue,
            oninput: () => {
              const newValue = this.parseValue(
                this.inputRef.current!.node.value,
              );
              _.$setD(value, newValue);
              this.$fire(newValue);
            },
          });
      },
    );
  }
}

@FluentUI.triggerComponent("fTextInput")
export class FTextInput extends FInput<string> {
  type = "text";
  parseValue(v: string) {
    return v;
  }
}

@FluentUI.triggerComponent("fNumberInput")
export class FNumberInput extends FInput<number> {
  type = "number";
  stringifier = (v: number) => (Number.isNaN(v) ? "" : String(v));
  parseValue(v: string) {
    return Number(v);
  }
}

@FluentUI.triggerComponent("fPasswordInput")
export class FPasswordInput extends FInput<string> {
  type = "password";
  parseValue(v: string) {
    return v;
  }
}

@FluentUI.triggerComponent("fUnderlineTextInput")
export class FUnderlineTextInput extends FTextInput {
  appearance: InputAppearance = "underline";
}

@FluentUI.triggerComponent("fUnderlineNumberInput")
export class FUnderlineNumberInput extends FNumberInput {
  appearance: InputAppearance = "underline";
}

@FluentUI.triggerComponent("fUnderlinePasswordInput")
export class FUnderlinePasswordInput extends FPasswordInput {
  appearance: InputAppearance = "underline";
}

declare module "refina" {
  interface TriggerComponents {
    fTextInput: FTextInput;
    fNumberInput: FNumberInput;
    fPasswordInput: FPasswordInput;
    fUnderlineTextInput: FUnderlineTextInput;
    fUnderlineNumberInput: FUnderlineNumberInput;
    fUnderlinePasswordInput: FUnderlinePasswordInput;
  }
}
