import {
  HTMLElementComponent,
  Model,
  TriggerComponent,
  _,
  ref,
  valueOf,
} from "refina";
import useStyles from "./styles";
import { FInputAppearance } from "./types";

export class FInput<T = string> extends TriggerComponent {
  stringifier: (v: T) => string = v => `${v}`;
  parseValue: (v: string) => T = v => v as any;
  appearance: FInputAppearance = "outline";
  type = "text";
  extraAttrs: Partial<HTMLInputElement> = {};
  inputRef = ref<HTMLElementComponent<"input">>();
  $main(
    value: Model<T>,
    disabled = false,
    placeholder = "",
  ): this is {
    $ev: T;
  } {
    const styles = useStyles(this.appearance, disabled, false);

    styles.root();
    _._span(
      {
        onclick: () => {
          this.inputRef.current?.node.focus();
        },
      },
      _ => {
        styles.input();
        _.$ref(this.inputRef) &&
          _._input({
            type: this.type,
            value: this.stringifier(valueOf(value)),
            disabled: disabled,
            placeholder: placeholder,
            oninput: () => {
              const newValue = this.parseValue(
                this.inputRef.current!.node.value,
              );
              this.$updateModel(value, newValue);
              this.$fire(newValue);
            },
            ...this.extraAttrs,
          });
      },
    );
    return this.$fired;
  }
}

export class FNumberInput extends FInput<number> {
  stringifier = (v: number) => (Number.isNaN(v) ? "" : String(v));
  parseValue = (v: string) => parseFloat(v);
  type = "number";
  extraAttrs: Partial<HTMLInputElement> = { step: "any" };
}

export class FPasswordInput extends FInput {
  type = "password";
}

export class FUnderlineInput extends FInput {
  appreance = "underline" as const;
}

export class FUnderlineNumberInput extends FNumberInput {
  appreance = "underline" as const;
}

export class FUnderlinePasswordInput extends FPasswordInput {
  appreance = "underline" as const;
}

export * from "./types";
