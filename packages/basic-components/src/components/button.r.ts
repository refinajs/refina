import { Content, D, getD } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    button(
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: MouseEvent;
    };
  }
}

Basics.triggerComponents.button = function (_) {
  return (inner, disabled = false) => {
    _._button(
      {
        onclick: this.$fire,
        disabled: getD(disabled),
        type: "button",
      },
      getD(inner),
    );
  };
};
