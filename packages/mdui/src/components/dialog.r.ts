import { Content, D, bindArgsToContent, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdControlledDialog(
      open: D<boolean>,
      title: D<Content>,
      body: D<Content>,
      actions?: D<Content>,
      presistent?: D<boolean>,
    ): void;
  }
}
MdUI.outputComponents.mdControlledDialog = function (_) {
  return (open, title, body, actions, presistent = false) => {
    const presistentProps = getD(presistent)
      ? {}
      : { closeOnOverlayClick: true, closeOnEsc: true };
    _._mdui_dialog(
      {
        ...presistentProps,
        open: getD(open),
      },
      _ => {
        _._div(
          {
            slot: "headline",
          },
          title,
        );
        _._div(
          {
            slot: "description",
          },
          body,
        );
        actions &&
          _._div(
            {
              slot: "action",
            },
            actions,
          );
      },
    );
  };
};

declare module "refina" {
  interface Components {
    mdDialog(
      trigger: D<Content<[open: (open?: D<boolean>) => void]>>,
      title: D<Content<[close: (open?: D<boolean>) => void]>>,
      body: D<Content<[close: (open?: D<boolean>) => void]>>,
      actions?: D<Content<[close: (open?: D<boolean>) => void]>>,
      presistent?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdDialog = function (_) {
  let opened = false;
  return (
    trigger: D<Content<[open: (open?: D<boolean>) => void]>>,
    title: D<Content<[close: (open?: D<boolean>) => void]>>,
    body: D<Content<[close: (open?: D<boolean>) => void]>>,
    actions?: D<Content<[close: (open?: D<boolean>) => void]>>,
    presistent: D<boolean> = false,
  ) => {
    const open = (open: D<boolean> = true) => {
      const openValue = getD(open);
      opened = openValue;
      this.$fire(openValue);
    };
    const close = (open: D<boolean> = false) => {
      const openValue = getD(open);
      opened = openValue;
      this.$fire(openValue);
    };

    _.embed(bindArgsToContent(trigger, open));
    _.mdControlledDialog(
      opened,
      bindArgsToContent(title, close),
      bindArgsToContent(body, close),
      actions && bindArgsToContent(actions, close),
      presistent,
    );
  };
};
