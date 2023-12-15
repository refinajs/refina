import { Button } from "mdui";
import { Content, D, getD } from "refina";
import MdUI from "../plugin";

export type ButtonVariant = Button["variant"];

declare module "refina" {
  interface Components {
    mdButton(
      inner: D<Content>,
      disabled?: D<boolean>,
      varient?: ButtonVariant,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdButton = function (_) {
  return (inner, disabled = false, variant = "filled") => {
    _._mdui_button(
      {
        disabled: getD(disabled),
        onclick: this.$fireWith(),
        variant: variant,
      },
      inner,
    );
  };
};

declare module "refina" {
  interface Components {
    mdTonalButton(
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdTonalButton = function (_) {
  return (inner, disabled) => _.mdButton(inner, disabled, "tonal");
};

declare module "refina" {
  interface Components {
    mdOutlinedButton(
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdOutlinedButton = function (_) {
  return (inner, disabled) => _.mdButton(inner, disabled, "outlined");
};

declare module "refina" {
  interface Components {
    mdTextButton(
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdTextButton = function (_) {
  return (inner, disabled) => _.mdButton(inner, disabled, "text");
};
