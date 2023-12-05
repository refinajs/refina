import { Button } from "mdui";
import { Content, Context, D, TriggerComponent, getD } from "refina";
import MdUI from "../plugin";

export type ButtonVariant = Button["variant"];

@MdUI.triggerComponent("mdButton")
export class MdButton extends TriggerComponent<void> {
  varient: ButtonVariant = "filled";

  main(_: Context, inner: D<Content>, disabled: D<boolean> = false): void {
    _._mdui_button(
      {
        disabled: getD(disabled),
        onclick: this.$fireWith(),
        variant: this.varient,
      },
      inner,
    );
  }
}

@MdUI.triggerComponent("mdTonalButton")
export class MdTonalButton extends MdButton {
  varient: ButtonVariant = "tonal";
}

@MdUI.triggerComponent("mdOutlinedButton")
export class MdOutlinedButton extends MdButton {
  varient: ButtonVariant = "outlined";
}

@MdUI.triggerComponent("mdTextButton")
export class MdTextButton extends MdButton {
  varient: ButtonVariant = "text";
}

declare module "refina" {
  interface TriggerComponents {
    mdButton: MdButton;
    mdTonalButton: MdTonalButton;
    mdOutlinedButton: MdOutlinedButton;
    mdTextButton: MdTextButton;
  }
}
