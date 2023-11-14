import { Content, D, TriggerComponent, ComponentContext, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fButton.styles";
import { FButtonApperance, FButtonShape } from "./types";

export abstract class FIntrinsicButton extends TriggerComponent<void> {
  abstract shape: FButtonShape;
  abstract appearance: FButtonApperance;
  main(_: ComponentContext, inner: D<Content>, disabled: D<boolean> = false): void {
    const disabledValue = getD(disabled);
    styles.root(this.shape, this.appearance, false, disabledValue, false)(_);
    _._button(
      {
        type: "button",
        disabled: disabledValue,
        onclick: this.$fireWith(),
      },
      inner,
    );
  }
}

@FluentUI.triggerComponent("fButton")
export class FButton extends FIntrinsicButton {
  shape: FButtonShape = "rounded";
  appearance: FButtonApperance = "secondary";
}

@FluentUI.triggerComponent("fPrimaryButton")
export class FPrimaryButton extends FIntrinsicButton {
  shape: FButtonShape = "rounded";
  appearance: FButtonApperance = "primary";
}

@FluentUI.triggerComponent("fCircularButton")
export class FCircularButton extends FIntrinsicButton {
  shape: FButtonShape = "circular";
  appearance: FButtonApperance = "secondary";
}

declare module "refina" {
  interface TriggerComponents {
    fButton: FButton;
    fPrimaryButton: FPrimaryButton;
    fCircularButton: FCircularButton;
  }
}
