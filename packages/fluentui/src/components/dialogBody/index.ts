import "@refina/fluentui-icons/dismiss.js";
import { Content, Context } from "refina";
import FluentUI from "../../plugin";
import dialogActionsStyles from "./actions.styles";
import dialogBodyStyles from "./body.styles";
import dialogContentStyles from "./content.styles";
import dialogTitleStyles from "./title.styles";

export const fromCloseButtonSym = Symbol("fDialogCloseEventFromCloseButton");
export type FDialogBodyEventData =
  | typeof fromCloseButtonSym
  | string
  | number
  | undefined;

declare module "refina" {
  interface Components {
    fDialogBody(
      title: Content,
      content: Content<[close: (ev?: FDialogBodyEventData) => void]>,
      actions?:
        | Content<[close: (ev?: FDialogBodyEventData) => void]>
        | undefined,
      actionsPosition?: "start" | "end",
      closeButton?: boolean,
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

    dialogBodyStyles.root(_);
    _._div({}, _ => {
      dialogTitleStyles.root(!closeButton)(_);
      _._div({}, title);

      if (closeButton) {
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
      _._div({}, wrapper(content));

      if (actions !== undefined) {
        dialogActionsStyles.root(true, actionsPosition)(_);
        _._div({}, wrapper(actions));
      }
    });
  };
};
