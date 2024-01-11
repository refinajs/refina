import { DOMElementComponent, Model, valueOf, ref } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    textarea(
      value: Model<string>,
      disabled?: boolean,
      placeholder?: string,
    ): this is {
      $ev: string;
    };
  }
}

Basics.triggerComponents.textarea = function (_) {
  let inputRef = ref<DOMElementComponent<"textarea">>();
  return (value, disabled, placeholder) => {
    _.$ref(inputRef) &&
      _._textarea({
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
