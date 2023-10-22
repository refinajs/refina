import { ComponentContext, Content, D, TriggerComponent, View, d, getD } from "refina";
import FluentUI from "../../plugin";
import "./fDialogBody.r";
import "./fDialogSurface.r";

@FluentUI.triggerComponent("fModalDialog")
export class FModalDialog extends TriggerComponent<void> {
  main(
    _: ComponentContext<this>,
    open: D<boolean>,
    title: D<Content>,
    content: D<Content<[close: () => void]>>,
    actions?: D<Content<[close: () => void]>>,
    actionsPosition: D<"start" | "end"> = "end",
    persist: D<boolean> = false,
    closeButton: D<boolean> = true,
  ): void {
    if (getD(open)) {
      if (
        _.fDialogSurface(_ => {
          if (_.fDialogBody(title, content, actions, actionsPosition, closeButton)) {
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
  }
}

@FluentUI.triggerComponent("fDialog")
export class FDialog extends TriggerComponent<boolean> {
  open = d(false);
  main(
    _: ComponentContext<this>,
    trigger: D<View<[open: (open?: boolean) => void]>>,
    title: D<Content>,
    content: D<Content<[close: () => void]>>,
    actions?: D<Content<[close: () => void]>>,
    actionsPosition: D<"start" | "end"> = "end",
    persist: D<boolean> = false,
  ): void {
    _.embed(ctx =>
      getD(trigger)(ctx, (open = true) => {
        this.open.value = open;
        this.$fire(open);
      }),
    );
    _.$main();
    if (_.fModalDialog(this.open, title, content, actions, actionsPosition, persist)) {
      this.$fire(false);
    }
  }
}

declare module "refina" {
  interface TriggerComponents {
    fModalDialog: FModalDialog;
    fDialog: FDialog;
  }
}
