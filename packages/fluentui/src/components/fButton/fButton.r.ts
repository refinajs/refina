import { Content, D, TriggerComponent, TriggerComponentContext, getD, triggerComponent } from "refina";
import styles from "./fButton.styles";
import { FButtonApperance, FButtonShape } from "./types";

@triggerComponent("fIntrinsicButton")
export class FIntrinsicButton extends TriggerComponent<void> {
  main(
    _: TriggerComponentContext<void, this>,
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
        onclick: _.$fireWith(),
      },
      inner,
    );
  }
}

@triggerComponent("fButton")
export class FButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("rounded", "secondary", inner, disabled) && _.$fire();
  }
}

@triggerComponent("fPrimaryButton")
export class FPrimaryButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("rounded", "primary", inner, disabled) && _.$fire();
  }
}

@triggerComponent("fCircularButton")
export class FCircularButton extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>, disabled: D<boolean> = false): void {
    _.fIntrinsicButton("circular", "secondary", inner, disabled) && _.$fire();
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
