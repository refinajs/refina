import { Content, D, View, d, getD } from "refina";
import FluentUI from "../../plugin";
import "./fDialogBody.r";
import "./fDialogSurface.r";

declare module "refina" {
  interface Components {
    fControlledDialog(
      open: D<boolean>,
      title: D<Content>,
      content: D<Content<[close: () => void]>>,
      actions?: D<Content<[close: () => void]>>,
      actionsPosition?: D<"start" | "end">,
      persist?: D<boolean>,
      closeButton?: D<boolean>,
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
    if (getD(open)) {
      if (
        _.fDialogSurface(_ => {
          if (
            _.fDialogBody(title, content, actions, actionsPosition, closeButton)
          ) {
            _.$setD(open, false);
            this.$fire();
          }
        })
      ) {
        if (!persist) {
          _.$setD(open, false);
          this.$fire();
        }
      }
    }
  };
};

declare module "refina" {
  interface Components {
    fDialog(
      trigger: D<View<[open: (open?: boolean) => void]>>,
      title: D<Content>,
      content: D<Content<[close: () => void]>>,
      actions?: D<Content<[close: () => void]>>,
      actionsPosition?: D<"start" | "end">,
      persist?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fDialog = function (_) {
  const opened = d(false);
  return (
    trigger,
    title,
    content,
    actions,
    actionsPosition = "end",
    persist = false,
  ) => {
    _.embed(ctx =>
      getD(trigger)(ctx, (open = true) => {
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
