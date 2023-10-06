import {
  Content,
  Context,
  D,
  TriggerComponent,
  TriggerComponentContext,
  View,
  d,
  getD,
  triggerComponent,
} from "refina";
import "./fDialogBody.r";
import "./fDialogSurface.r";
import { fromCloseButtonSym } from "./fDialogBody.r";

@triggerComponent("fModalDialog")
export class FModalDialog extends TriggerComponent<void> {
  main(
    _: TriggerComponentContext<void, this>,
    open: D<boolean>,
    title: D<Content>,
    content: D<Content>,
    actions?: D<Content<[close: () => void]>>,
    actionsPosition: D<"start" | "end"> = "end",
    persist: D<boolean> = false,
    closeButton: D<boolean> = true,
  ): void {
    if (getD(open)) {
      if (
        _.fDialogSurface(() => {
          if (_.fDialogBody(title, content, actions, actionsPosition, closeButton)) {
            _.$setD(open, false);
            _.$fire();
          }
        })
      ) {
        if (!persist) {
          _.$setD(open, false);
          _.$fire();
        }
      }
    }
  }
}

@triggerComponent("fDialog")
export class FDialog extends TriggerComponent<boolean> {
  open = d(false);
  main(
    _: TriggerComponentContext<boolean, this>,
    trigger: D<View<[open: () => void]>>,
    title: D<Content>,
    content: D<Content>,
    actions?: D<Content<[close: () => void]>>,
    actionsPosition: D<"start" | "end"> = "end",
    persist: D<boolean> = false,
  ): void {
    _.embed((ctx) =>
      getD(trigger)(ctx, () => {
        this.open.value = true;
        _.$update();
      }),
    );
    _.fModalDialog(this.open, title, content, actions, actionsPosition, persist);
  }
}

declare module "refina" {
  interface TriggerComponents {
    fModalDialog: FModalDialog;
    fDialog: FDialog;
  }
}
