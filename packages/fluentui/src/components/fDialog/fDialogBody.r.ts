import "@refina/fluentui-icons/dismiss.r.js";
import { Content, D, TriggerComponent, TriggerComponentContext, getD, triggerComponent } from "refina";
import dialogActionsStyles from "./dialogActions.styles";
import dialogBodyStyles from "./dialogBody.styles";
import dialogContentStyles from "./dialogContent.styles";
import dialogTitleStyles from "./dialogTitle.styles";

export const fromCloseButtonSym = Symbol("fDialogCloseEventFromCloseButton");
export type FDialogBodyEventData = typeof fromCloseButtonSym | string | number | undefined;

@triggerComponent("fDialogBody")
export class FDialogBody extends TriggerComponent<FDialogBodyEventData> {
  main(
    _: TriggerComponentContext<FDialogBodyEventData, this>,
    title: D<Content>,
    content: D<Content>,
    actions?: D<Content<[close: (ev?: FDialogBodyEventData) => void]> | undefined>,
    actionsPosition: D<"start" | "end"> = "start",
    closeButton: D<boolean> = false,
  ): void {
    const actionsValue = getD(actions),
      closeButtonValue = getD(closeButton);

    dialogBodyStyles.root(_);
    _._div({}, () => {
      dialogTitleStyles.root(!closeButtonValue)(_);
      _._div({}, title);

      if (closeButtonValue) {
        dialogTitleStyles.action(_);
        _._div({}, () => {
          dialogTitleStyles.closeButton(_);
          _._button(
            {
              type: "button",
              onclick: _.$fireWith(fromCloseButtonSym),
            },
            () => _.fiDismiss20Regular(),
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
            ? (ctx) =>
                actionsValue(ctx, (x) => {
                  console.warn("!!!");
                  _.$fire(x);
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