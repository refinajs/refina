import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI2 from "../plugin";
import { TextField } from "mdui";

export type TextFieldVariant = TextField["variant"];

@MdUI2.triggerComponent("mdTextField")
export class MdTextField extends TriggerComponent<string> {
  varient: TextFieldVariant = "filled";

  inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  main(_: ComponentContext, value: D<string>, label?: D<string>, disabled: D<boolean> = false): void {
    _.$ref(this.inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: this.varient,
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

@MdUI2.triggerComponent("mdOutlinedTextField")
export class MdOutlinedTextField extends MdTextField {
  varient: TextFieldVariant = "outlined";
}

@MdUI2.triggerComponent("mdPasswordInput")
export class MdPasswordInput extends TriggerComponent<string> {
  varient: TextFieldVariant = "filled";

  inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  main(_: ComponentContext, value: D<string>, label?: D<string>, disabled: D<boolean> = false): void {
    _.$ref(this.inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: this.varient,
        type: "password",
        togglePassword: true,
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

@MdUI2.triggerComponent("mdOutlinedPasswordInput")
export class MdOutlinedPasswordInput extends MdPasswordInput {
  varient: TextFieldVariant = "outlined";
}

declare module "refina" {
  interface TriggerComponents {
    mdTextField: MdTextField;
    mdOutlinedTextField: MdOutlinedTextField;
    mdPasswordInput: MdPasswordInput;
    mdOutlinedPasswordInput: MdOutlinedPasswordInput;
  }
}
