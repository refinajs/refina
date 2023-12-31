import "@refina/fluentui-icons/dismiss.js";
import { Content, Context, D, getD } from "refina";
import FluentUI from "../../plugin";
import dialogActionsStyles from "./dialogActions.styles";
import dialogBodyStyles from "./dialogBody.styles";
import dialogContentStyles from "./dialogContent.styles";
import dialogTitleStyles from "./dialogTitle.styles";

export const fromCloseButtonSym = Symbol("fDialogCloseEventFromCloseButton");
export type FDialogBodyEventData =
  | typeof fromCloseButtonSym
  | string
  | number
  | undefined;

declare module "refina" {
  interface Components {
    fDialogBody(
      title: D<Content>,
      content: D<Content<[close: (ev?: FDialogBodyEventData) => void]>>,
      actions?: D<
        Content<[close: (ev?: FDialogBodyEventData) => void]> | undefined
      >,
      actionsPosition?: D<"start" | "end">,
      closeButton?: D<boolean>,
    ): this is {
      $ev: FDialogBodyEventData;
    };
  }
}

FluentUI.triggerComponents.fDialogBody = function (_) {
  return (
    title,
    content,
    actions,
    actionsPosition = "start",
    closeButton = false,
  ) => {
    const wrapper = (
      content: Content<[close: (ev?: FDialogBodyEventData) => void]>,
    ) => {
      if (typeof content === "function") {
        return (ctx: Context) => content(ctx, this.$fire);
      }
      return content;
    };

    const contentValue = getD(content),
      actionsValue = getD(actions),
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
      _._div({}, wrapper(contentValue));

      if (actionsValue !== undefined) {
        dialogActionsStyles.root(true, getD(actionsPosition))(_);
        _._div({}, wrapper(actionsValue));
      }
    });
  };
};
