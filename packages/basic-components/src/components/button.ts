import { Content } from "refina";
import Basics from "../plugin";

declare module "refina" {
  interface Components {
    button(
      inner: Content,
      disabled?: boolean,
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
        disabled,
        type: "button",
      },
      inner,
    );
  };
};
