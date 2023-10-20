import "@refina/fluentui-icons/dismiss.r.js";
import { ComponentContext, Content, D, TriggerComponent, getD } from "refina";
import FluentUI from "../../plugin";
import dialogActionsStyles from "./dialogActions.styles";
import dialogBodyStyles from "./dialogBody.styles";
import dialogContentStyles from "./dialogContent.styles";
import dialogTitleStyles from "./dialogTitle.styles";

export const fromCloseButtonSym = Symbol("fDialogCloseEventFromCloseButton");
export type FDialogBodyEventData = typeof fromCloseButtonSym | string | number | undefined;

@FluentUI.triggerComponent("fDialogBody")
export class FDialogBody extends TriggerComponent<FDialogBodyEventData> {
  main(
    _: ComponentContext<this>,
    title: D<Content>,
    content: D<Content>,
    actions?: D<Content<[close: (ev?: FDialogBodyEventData) => void]> | undefined>,
    actionsPosition: D<"start" | "end"> = "start",
    closeButton: D<boolean> = false,
  ): void {
    const actionsValue = getD(actions),
      closeButtonValue = getD(closeButton);

    dialogBodyStyles.root(_);
    _._div({}, _ => {
      dialogTitleStyles.root(!closeButtonValue)(_);
      _._div({}, title);

      if (closeButtonValue) {
        dialogTitleStyles.action(_);
        _._div({}, _ => {
          dialogTitleStyles.closeButton(_);
          _._button(
            {
              type: "button",
              onclick: this.$fireWith(fromCloseButtonSym),
            },
            _ => _.fiDismiss20Regular(),
          );
        });
      }

      dialogContentStyles.root(_);
      _._div({}, content);

      if (actionsValue !== undefined) {
        dialogActionsStyles.root(true, getD(actionsPosition))(_);
        _._div(
          {},
          typeof actionsValue === "function"
            ? ctx =>
                actionsValue(ctx, ev => {
                  this.$fire(ev);
                })
            : actionsValue,
        );
      }
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    fDialogBody: FDialogBody;
  }
}
