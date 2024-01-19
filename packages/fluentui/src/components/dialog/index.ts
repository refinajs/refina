import { Content, Model, View, model, valueOf } from "refina";
import FluentUI from "../../plugin";

declare module "refina" {
  interface Components {
    fControlledDialog(
      open: Model<boolean>,
      title: Content,
      content: Content<[close: () => void]>,
      actions?: Content<[close: () => void]>,
      actionsPosition?: "start" | "end",
      persist?: boolean,
      closeButton?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fControlledDialog = function (_) {
  return (
    open,
    title,
    content,
    actions,
    actionsPosition = "end",
    persist = false,
    closeButton = true,
  ) => {
    if (valueOf(open)) {
      if (
        _.fDialogSurface(_ => {
          if (
            _.fDialogBody(title, content, actions, actionsPosition, closeButton)
          ) {
            _.$updateModel(open, false);
            this.$fire();
          }
        })
      ) {
        if (!persist) {
          _.$updateModel(open, false);
          this.$fire();
        }
      }
    }
  };
};

declare module "refina" {
  interface Components {
    fDialog(
      trigger: View<[open: (open?: boolean) => void]>,
      title: Content,
      content: Content<[close: () => void]>,
      actions?: Content<[close: () => void]>,
      actionsPosition?: "start" | "end",
      persist?: boolean,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fDialog = function (_) {
  const opened = model(false);
  return (
    trigger,
    title,
    content,
    actions,
    actionsPosition = "end",
    persist = false,
  ) => {
    _.embed(ctx =>
      trigger(ctx, (open = true) => {
        opened.value = open;
        this.$fire(open);
      }),
    );
    this.$main();
    if (
      _.fControlledDialog(
        opened,
        title,
        content,
        actions,
        actionsPosition,
        persist,
      )
    ) {
      this.$fire(false);
    }
  };
};
