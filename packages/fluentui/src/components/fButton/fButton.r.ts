import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fButton.styles";
import { FButtonApperance, FButtonShape } from "./types";

declare module "refina" {
  interface Components {
    fButton(
      inner: D<Content>,
      disabled?: D<boolean>,
      shape?: FButtonShape,
      appearance?: FButtonApperance,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fButton = function (_) {
  return (
    inner,
    disabled = false,
    shape = "rounded",
    appearance = "secondary",
  ) => {
    const disabledValue = getD(disabled);
    styles.root(shape, appearance, false, disabledValue, false)(_);
    _._button(
      {
        type: "button",
        disabled: disabledValue,
        onclick: this.$fireWith(),
      },
      inner,
    );
  };
};

declare module "refina" {
  interface Components {
    fPrimaryButton(
      inner: D<Content>,
      disabled?: D<boolean>,
      shape?: FButtonShape,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fPrimaryButton = function (_) {
  return (inner, disabled, shape) =>
    _.fButton(inner, disabled, shape, "primary");
};

declare module "refina" {
  interface Components {
    fCircularButton(
      inner: D<Content>,
      disabled?: D<boolean>,
      appearance?: FButtonApperance,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fCircularButton = function (_) {
  return (inner, disabled, appearance) =>
    _.fButton(inner, disabled, "circular", appearance);
};
