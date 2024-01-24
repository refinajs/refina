import { TextField } from "mdui";
import { Model, TriggerComponent, _, elementRef, valueOf } from "refina";

export type MdTextFieldVariant = TextField["variant"];

export class MdTextField extends TriggerComponent {
  variant: MdTextFieldVariant = "filled";
  type = "text";
  inputRef = elementRef<"mdui-text-field">();
  $main(
    value: Model<string>,
    label?: string,
    disabled = false,
  ): this is {
    $ev: string;
  } {
    _.$ref(this.inputRef);
    _._mdui_text_field({
      value: valueOf(value),
      label,
      disabled,
      variant: this.variant,
      oninput: () => {
        const newValue = this.inputRef.current!.node.value;
        this.$updateModel(value, newValue);
        this.$fire(newValue);
      },
    });
    return this.$fired;
  }
}

export class MdOutlinedTextField extends MdTextField {
  variant = "outlined" as const;
}

export class MdPasswordInput extends MdTextField {
  type = "password";
}

export class MdOutlinedPasswordInput extends MdPasswordInput {
  variant = "outlined" as const;
}

export class MdTextarea extends TriggerComponent {
  rows?: number | [min?: number, max?: number];
  variant: MdTextFieldVariant = "filled";
  inputRef = elementRef<"mdui-text-field">();
  $main(
    value: Model<string>,
    label?: string,
    disabled = false,
  ): this is {
    $ev: string;
  } {
    const rowsProps = Array.isArray(this.rows)
      ? {
          autosize: true,
          minRows: this.rows[0],
          maxRows: this.rows[1],
        }
      : {
          rows: this.rows ?? 3,
        };

    _.$ref(this.inputRef);
    _._mdui_text_field({
      value: valueOf(value),
      label,
      disabled,
      variant: this.variant,
      ...rowsProps,
      oninput: () => {
        const newValue = this.inputRef.current!.node.value;
        this.$updateModel(value, newValue);
        this.$fire(newValue);
      },
    });
    return this.$fired;
  }
}

export class MdOutlinedTextarea extends MdTextarea {
  variant = "outlined" as const;
}
