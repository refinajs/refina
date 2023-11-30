import { ButtonIcon } from "mdui";
import { Context, D, TriggerComponent, getD } from "refina";
import MdUI2 from "../plugin";

export type ButtonIconVariant = ButtonIcon["variant"];

@MdUI2.triggerComponent("mdIconButton")
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

@MdUI2.triggerComponent("mdFilledIconButton")
export class MdFilledIconButton extends MdIconButton {
  varient: ButtonIconVariant = "filled";
}

@MdUI2.triggerComponent("mdTonalIconButton")
export class MdTonalIconButton extends MdIconButton {
  varient: ButtonIconVariant = "tonal";
}

@MdUI2.triggerComponent("mdOutlinedIconButton")
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
