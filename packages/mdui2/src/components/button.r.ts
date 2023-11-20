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

declare module "refina" {
  interface TriggerComponents {
    mdButton: MdButton;
  }
}
