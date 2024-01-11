import { Content, bindArgsToContent } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdControlledNavDrawerProps: {
      contained: boolean;
    };
    mdControlledNavDrawer(open: boolean, inner: Content, modal?: boolean): void;
  }
}
MdUI.outputComponents.mdControlledNavDrawer = function (_) {
  return (open, inner, modal = false) => {
    const modalOptions = modal
      ? { modal: true, "close-on-esc": true, "close-on-overlay-click": true }
      : {};
    _._mdui_navigation_drawer(
      { ...modalOptions, open, contained: this.$props.contained },
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
      trigger: Content<[open: (open?: boolean) => void]>,
      inner: Content<[close: (open?: boolean) => void]>,
      modal?: boolean,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdNavDrawer = function (_) {
  let opened = false;
  return (
    trigger: Content<[open: (open?: boolean) => void]>,
    inner: Content<[close: (open?: boolean) => void]>,
    modal: boolean = false,
  ) => {
    _.embed(
      bindArgsToContent(trigger, (open = true) => {
        opened = open;
        this.$fire(open);
      }),
    );
    _.mdControlledNavDrawer(
      opened,
      bindArgsToContent(inner, (open = false) => {
        opened = open;
        this.$fire(open);
      }),
      modal,
    );
  };
};
