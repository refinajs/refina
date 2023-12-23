import { D, HTMLElementComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./input.styles";
import { InputAppearance } from "./input.types";

declare module "refina" {
  interface Components {
    fInput<T>(
      value: D<T>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
      type?: string,
      appearance?: InputAppearance,
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
    const valueValue = getD(value),
      disabledValue = getD(disabled),
      placeholderValue = getD(placeholder);

    styles.root(appearance, disabledValue, false)(_);
    _._span(
      {
        onclick: () => {
          inputRef.current?.node.focus();
        },
      },
      _ => {
        styles.input(disabledValue)(_);
        _.$ref(inputRef) &&
          _._input({
            type,
            value: stringifier(valueValue),
            disabled: disabledValue,
            placeholder: placeholderValue,
            oninput: () => {
              const newValue = parseValue(inputRef.current!.node.value);
              _.$setD(value, newValue);
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
      value: D<number>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
      appearance?: InputAppearance,
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
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
      appearance?: InputAppearance,
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
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
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
      value: D<number>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
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
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
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
