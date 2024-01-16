import { DOMElementComponent, Model, valueOf, ref } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    input(
      type: string,
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: string;
    };

    textInput(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: string;
    };

    passwordInput(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: string;
    };

    checkbox(checked: Model<boolean>): this is {
      $ev: boolean;
    };
  }
}

Basics.triggerComponents.input = function (_) {
  let inputRef = ref<DOMElementComponent<"input">>();
  return (type, value, disabled, placeholder) => {
    _.$ref(inputRef) &&
      _._input({
        type,
        disabled,
        placeholder,
        value: valueOf(value),
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

Basics.triggerComponents.textInput = function (_) {
  return (value, disabled, placeholder) => {
    _.input("text", value, disabled, placeholder) && this.$fire(_.$ev);
  };
};

Basics.triggerComponents.passwordInput = function (_) {
  return (value, disabled, placeholder) => {
    _.input("password", value, disabled, placeholder) && this.$fire(_.$ev);
  };
};

Basics.triggerComponents.checkbox = function (_) {
  let inputRef = ref<DOMElementComponent<"input">>();
  return checked => {
    _.$ref(inputRef) &&
      _._input({
        type: "checkbox",
        checked: valueOf(checked),
        onchange: () => {
          const newChecked = inputRef.current!.node.checked;
          _.$updateModel(checked, newChecked);
          this.$fire(newChecked);
        },
      });
  };
};
