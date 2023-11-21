import { Button } from "mdui";
import { ComponentContext, Content, D, TriggerComponent, getD } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdButton")
export class MdButton extends TriggerComponent<void> {
  varient: Button["variant"];

  main(_: ComponentContext, inner: D<Content>, disabled: D<boolean> = false): void {
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

@MdUI2.triggerComponent("mdTonalButton")
export class MdTonalButton extends MdButton {
  varient: Button["variant"] = "tonal";
}

@MdUI2.triggerComponent("mdOutlinedButton")
export class MdOutlinedButton extends MdButton {
  varient: Button["variant"] = "outlined";
}

@MdUI2.triggerComponent("mdTextButton")
export class MdTextButton extends MdButton {
  varient: Button["variant"] = "text";
}

declare module "refina" {
  interface TriggerComponents {
    mdButton: MdButton;
    mdTonalButton: MdTonalButton;
    mdOutlinedButton: MdOutlinedButton;
    mdTextButton: MdTextButton;
  }
}
