import { Content, D, TriggerComponent, ComponentContext, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fButton.styles";
import { FButtonApperance, FButtonShape } from "./types";

@FluentUI.triggerComponent("fIntrinsicButton")
export class FIntrinsicButton extends TriggerComponent<void> {
  main(
    _: ComponentContext<this>,
    shape: D<FButtonShape>,
    appearance: D<FButtonApperance>,
    inner: D<Content>,
    disabled: D<boolean> = false,
  ): void {
    const disabledValue = getD(disabled);
    styles.root(getD(shape), getD(appearance), false, disabledValue, false)(_);
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
export class FButton extends TriggerComponent<void> {
  main(_: ComponentContext<this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("rounded", "secondary", inner, disabled) && this.$fire();
  }
}

@FluentUI.triggerComponent("fPrimaryButton")
export class FPrimaryButton extends TriggerComponent<void> {
  main(_: ComponentContext<this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("rounded", "primary", inner, disabled) && this.$fire();
  }
}

@FluentUI.triggerComponent("fCircularButton")
export class FCircularButton extends TriggerComponent<void> {
  main(_: ComponentContext<this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("circular", "secondary", inner, disabled) && this.$fire();
  }
}

declare module "refina" {
  interface TriggerComponents {
    fIntrinsicButton: FIntrinsicButton;
    fButton: FButton;
    fPrimaryButton: FPrimaryButton;
    fCircularButton: FCircularButton;
  }
}
