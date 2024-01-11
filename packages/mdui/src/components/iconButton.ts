import { ButtonIcon } from "mdui";
import MdUI from "../plugin";

export type ButtonIconVariant = ButtonIcon["variant"];

declare module "refina" {
  interface Components {
    mdIconButton(
      icon: string,
      disabled?: boolean,
      varient?: ButtonIconVariant,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdIconButton = function (_) {
  return (icon, disabled = false, varient = "standard") => {
    _._mdui_button_icon({
      icon,
      disabled,
      onclick: this.$fireWith(),
      variant: varient,
    });
  };
};

declare module "refina" {
  interface Components {
    mdFilledIconButton(
      icon: string,
      disabled?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdFilledIconButton = function (_) {
  return (icon, disabled) =>
    _.mdIconButton(icon, disabled, "filled") && this.$fire();
};

declare module "refina" {
  interface Components {
    mdTonalIconButton(
      icon: string,
      disabled?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdTonalIconButton = function (_) {
  return (icon, disabled) =>
    _.mdIconButton(icon, disabled, "tonal") && this.$fire();
};

declare module "refina" {
  interface Components {
    mdOutlinedIconButton(
      icon: string,
      disabled?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdOutlinedIconButton = function (_) {
  return (icon, disabled) =>
    _.mdIconButton(icon, disabled, "outlined") && this.$fire();
};
