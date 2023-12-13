import { D, DOMElementComponent, getD, ref } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    input(
      type: D<string>,
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
    ): this is {
      $ev: string;
    };

    textInput(
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
    ): this is {
      $ev: string;
    };

    passwordInput(
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
    ): this is {
      $ev: string;
    };

    checkbox(checked: D<boolean>): this is {
      $ev: boolean;
    };
  }
}

Basics.triggerComponents.input = function (_) {
  let inputRef = ref<DOMElementComponent<"input">>();
  return (type, value, disabled, placeholder) => {
    _.$ref(inputRef) &&
      _._input({
        type: getD(type),
        disabled: getD(disabled),
        placeholder: getD(placeholder),
        value: getD(value),
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

Basics.triggerComponents.textInput = function (_) {
  return (value, disabled, placeholder) => {
    _.input("text", value, disabled, placeholder);
  };
};

Basics.triggerComponents.passwordInput = function (_) {
  return (value, disabled, placeholder) => {
    _.input("password", value, disabled, placeholder);
  };
};

Basics.triggerComponents.checkbox = function (_) {
  let inputRef = ref<DOMElementComponent<"input">>();
  return checked => {
    _.$ref(inputRef) &&
      _._input({
        type: "checkbox",
        checked: getD(checked),
        onchange: () => {
          const newChecked = inputRef.current!.node.checked;
          _.$setD(checked, newChecked);
          this.$fire(newChecked);
        },
      });
  };
};
