import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";
import { FInputAppearance } from "./types";

declare module "refina" {
  interface Components {
    fInput<T>(
      value: Model<T>,
      disabled?: boolean,
      placeholder?: string,
      type?: string,
      appearance?: FInputAppearance,
      stringifier?: (v: T) => string,
      parseValue?: (v: string) => T,
    ): this is {
      $ev: T;
    };
  }
}
FluentUI.triggerComponents.fInput = function (_) {
  const inputRef = ref<HTMLElementComponent<"input">>();
  return (
    value,
    disabled = false,
    placeholder = "",
    type = "text",
    appearance = "outline",
    stringifier = v => `${v}`,
    parseValue = v => v as any,
  ) => {
    styles.root(appearance, disabled, false)(_);
    _._span(
      {
        onclick: () => {
          inputRef.current?.node.focus();
        },
      },
      _ => {
        styles.input(disabled)(_);
        _.$ref(inputRef) &&
          _._input({
            type,
            value: stringifier(valueOf(value)),
            disabled: disabled,
            placeholder: placeholder,
            oninput: () => {
              const newValue = parseValue(inputRef.current!.node.value);
              _.$updateModel(value, newValue);
              this.$fire(newValue);
            },
          });
      },
    );
  };
};

declare module "refina" {
  interface Components {
    fNumberInput(
      value: Model<number>,
      disabled?: boolean,
      placeholder?: string,
      appearance?: FInputAppearance,
    ): this is {
      $ev: number;
    };
  }
}
FluentUI.triggerComponents.fNumberInput = function (_) {
  return (value, disabled, placeholder, appearance = "outline") =>
    _.fInput(
      value,
      disabled,
      placeholder,
      "number",
      appearance,
      v => (Number.isNaN(v) ? "" : String(v)),
      v => parseInt(v),
    ) && this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    fPasswordInput(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
      appearance?: FInputAppearance,
    ): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fPasswordInput = function (_) {
  return (value, disabled, placeholder, appearance = "outline") =>
    _.fInput(value, disabled, placeholder, "password", appearance) &&
    this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    fUnderlineInput(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
      type?: string,
    ): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fUnderlineInput = function (_) {
  return (value, disabled, placeholder, type) =>
    _.fInput(value, disabled, placeholder, type, "underline") &&
    this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    fUnderlineNumberInput(
      value: Model<number>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: number;
    };
  }
}
FluentUI.triggerComponents.fUnderlineNumberInput = function (_) {
  return (value, disabled, placeholder) =>
    _.fNumberInput(value, disabled, placeholder, "underline") &&
    this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    fUnderlinePasswordInput(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: string;
    };
  }
}
FluentUI.triggerComponents.fUnderlinePasswordInput = function (_) {
  return (value, disabled, placeholder) =>
    _.fPasswordInput(value, disabled, placeholder, "underline") &&
    this.$fire(_.$ev);
};

export * from "./types";
