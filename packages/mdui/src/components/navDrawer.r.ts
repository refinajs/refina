import { Content, D, bindArgsToContent, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdControlledNavDrawerProps: {
      contained: boolean;
    };
    mdControlledNavDrawer(
      open: D<boolean>,
      inner: D<Content>,
      modal?: D<boolean>,
    ): void;
  }
}
MdUI.outputComponents.mdControlledNavDrawer = function (_) {
  return (open, inner, modal = false) => {
    const modalOptions = getD(modal)
      ? { modal: true, "close-on-esc": true, "close-on-overlay-click": true }
      : {};
    _._mdui_navigation_drawer(
      { ...modalOptions, open: getD(open), contained: this.$props.contained },
      inner,
    );
  };
};

declare module "refina" {
  interface Components {
    MdNavDrawerProps: {
      contained: boolean;
    };
    mdNavDrawer(
      trigger: D<Content<[open: (open?: boolean) => void]>>,
      inner: D<Content<[close: (open?: boolean) => void]>>,
      modal?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdNavDrawer = function (_) {
  let open = false;
  return (
    trigger: D<Content<[open: (open?: boolean) => void]>>,
    inner: D<Content<[close: (open?: boolean) => void]>>,
    modal: D<boolean> = false,
  ) => {
    _.embed(
      bindArgsToContent(trigger, (open = true) => {
        open = open;
        _.$update();
      }),
    );
    _.mdControlledNavDrawer(
      open,
      bindArgsToContent(inner, (open = false) => {
        open = open;
        _.$update();
      }),
      modal,
    );
  };
};
