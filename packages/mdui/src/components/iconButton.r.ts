import { ButtonIcon } from "mdui";
import { Context, D, TriggerComponent, getD } from "refina";
import MdUI from "../plugin";

export type ButtonIconVariant = ButtonIcon["variant"];

@MdUI.triggerComponent("mdIconButton")
export class MdIconButton extends TriggerComponent<void> {
  varient: ButtonIconVariant = "standard";

  main(_: Context, icon: D<string>, disabled: D<boolean> = false): void {
    _._mdui_button_icon({
      icon: getD(icon),
      disabled: getD(disabled),
      onclick: this.$fireWith(),
      variant: this.varient,
    });
  }
}

@MdUI.triggerComponent("mdFilledIconButton")
export class MdFilledIconButton extends MdIconButton {
  varient: ButtonIconVariant = "filled";
}

@MdUI.triggerComponent("mdTonalIconButton")
export class MdTonalIconButton extends MdIconButton {
  varient: ButtonIconVariant = "tonal";
}

@MdUI.triggerComponent("mdOutlinedIconButton")
export class MdOutlinedIconButton extends MdIconButton {
  varient: ButtonIconVariant = "outlined";
}

declare module "refina" {
  interface TriggerComponents {
    mdIconButton: MdIconButton;
    mdFilledIconButton: MdFilledIconButton;
    mdTonalIconButton: MdTonalIconButton;
    mdOutlinedIconButton: MdOutlinedIconButton;
  }
}
