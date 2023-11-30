import { TextField } from "mdui";
import {
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

export type TextFieldVariant = TextField["variant"];

@MdUI2.triggerComponent("mdTextField")
export class MdTextField extends TriggerComponent<string> {
  varient: TextFieldVariant = "filled";

  inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  main(
    _: Context,
    value: D<string>,
    label?: D<string>,
    disabled: D<boolean> = false,
  ): void {
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
  main(
    _: Context,
    value: D<string>,
    label?: D<string>,
    disabled: D<boolean> = false,
  ): void {
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

@MdUI2.triggerComponent("mdTextarea")
export class MdTextarea extends TriggerComponent<
  string,
  {
    rows: number | [min?: number, max?: number];
  }
> {
  varient: TextFieldVariant = "filled";

  inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  main(
    _: Context,
    value: D<string>,
    label?: D<string>,
    disabled: D<boolean> = false,
  ): void {
    const rowsProps = Array.isArray(this.$props.rows)
      ? {
          autosize: true,
          minRows: this.$props.rows[0],
          maxRows: this.$props.rows[1],
        }
      : {
          rows: this.$props.rows ?? 3,
        };

    _.$ref(this.inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: this.varient,
        ...rowsProps,
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

@MdUI2.triggerComponent("mdOutlinedTextarea")
export class MdOutlinedTextarea extends MdTextarea {
  varient: TextFieldVariant = "outlined";
}

declare module "refina" {
  interface TriggerComponents {
    mdTextField: MdTextField;
    mdOutlinedTextField: MdOutlinedTextField;
    mdPasswordInput: MdPasswordInput;
    mdOutlinedPasswordInput: MdOutlinedPasswordInput;
    mdTextarea: MdTextarea;
    mdOutlinedTextarea: MdOutlinedTextarea;
  }
}
