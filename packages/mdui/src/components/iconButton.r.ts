import { ButtonIcon } from "mdui";
import { D, getD } from "refina";
import MdUI from "../plugin";

export type ButtonIconVariant = ButtonIcon["variant"];

declare module "refina" {
  interface Components {
    mdIconButton(
      icon: D<string>,
      disabled?: D<boolean>,
      varient?: ButtonIconVariant,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdIconButton = function (_) {
  return (icon, disabled = false, varient = "standard") => {
    _._mdui_button_icon({
      icon: getD(icon),
      disabled: getD(disabled),
      onclick: this.$fireWith(),
      variant: varient,
    });
  };
};

declare module "refina" {
  interface Components {
    mdFilledIconButton(
      icon: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdFilledIconButton = function (_) {
  return (icon, disabled) => _.mdIconButton(icon, disabled, "filled");
};

declare module "refina" {
  interface Components {
    mdTonalIconButton(
      icon: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdTonalIconButton = function (_) {
  return (icon, disabled) => _.mdIconButton(icon, disabled, "tonal");
};

declare module "refina" {
  interface Components {
    mdOutlinedIconButton(
      icon: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdOutlinedIconButton = function (_) {
  return (icon, disabled) => _.mdIconButton(icon, disabled, "outlined");
};
