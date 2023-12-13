import { D, DOMElementComponent, getD, ref } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    textarea(
      value: D<string>,
      disabled?: D<boolean>,
      placeholder?: D<string>,
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
