import { ButtonIcon } from "mdui";
import { ComponentContext, D, TriggerComponent, getD } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdIconButton")
export class MdIconButton extends TriggerComponent<void> {
  varient: ButtonIcon["variant"];

  main(_: ComponentContext, icon: D<string>, disabled: D<boolean> = false): void {
    _._mdui_button_icon({
      icon: getD(icon),
      disabled: getD(disabled),
      onclick: this.$fireWith(),
      variant: this.varient,
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdIconButton: MdIconButton;
  }
}
