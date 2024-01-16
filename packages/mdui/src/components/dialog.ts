import { Content, bindArgsToContent } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdControlledDialog(
      open: boolean,
      title: Content,
      body: Content,
      actions?: Content,
      presistent?: boolean,
    ): void;
  }
}
MdUI.outputComponents.mdControlledDialog = function (_) {
  return (open, title, body, actions, presistent = false) => {
    const presistentProps = presistent
      ? {}
      : { closeOnOverlayClick: true, closeOnEsc: true };
    _._mdui_dialog(
      {
        ...presistentProps,
        open,
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
      trigger: Content<[open: (open?: boolean) => void]>,
      title: Content<[close: (open?: boolean) => void]>,
      body: Content<[close: (open?: boolean) => void]>,
      actions?: Content<[close: (open?: boolean) => void]>,
      presistent?: boolean,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdDialog = function (_) {
  let opened = false;
  return (
    trigger: Content<[open: (open?: boolean) => void]>,
    title: Content<[close: (open?: boolean) => void]>,
    body: Content<[close: (open?: boolean) => void]>,
    actions?: Content<[close: (open?: boolean) => void]>,
    presistent: boolean = false,
  ) => {
    const open = (open = true) => {
      opened = open;
      this.$fire(open);
    };
    const close = (open = false) => {
      opened = open;
      this.$fire(open);
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
