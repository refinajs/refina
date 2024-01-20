import { Content } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";
import { FButtonApperance, FButtonShape } from "./types";

declare module "refina" {
  interface Components {
    fButton(
      inner: Content,
      disabled?: boolean,
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
    const styles = useStyles(shape, appearance, false, disabled, false);

    styles.root();
    _._button(
      {
        type: "button",
        disabled,
        onclick: this.$fireWith(),
      },
      inner,
    );
  };
};

declare module "refina" {
  interface Components {
    fPrimaryButton(
      inner: Content,
      disabled?: boolean,
      shape?: FButtonShape,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fPrimaryButton = function (_) {
  return (inner, disabled, shape) =>
    _.fButton(inner, disabled, shape, "primary") && this.$fire();
};

declare module "refina" {
  interface Components {
    fCircularButton(
      inner: Content,
      disabled?: boolean,
      appearance?: FButtonApperance,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fCircularButton = function (_) {
  return (inner, disabled, appearance) =>
    _.fButton(inner, disabled, "circular", appearance) && this.$fire();
};

export * from "./types";
