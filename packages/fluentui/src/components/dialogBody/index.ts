import "@refina/fluentui-icons/dismiss.js";
import { Content, Context } from "refina";
import FluentUI from "../../plugin";
import useActionsStyles from "./actions.styles";
import useBodyStyles from "./body.styles";
import useContentStyles from "./content.styles";
import useTitleStyles from "./title.styles";

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
    const bodyStyles = useBodyStyles();
    const titleStyles = useTitleStyles(!closeButton);
    const contentStyles = useContentStyles();
    const actionsStyles = useActionsStyles(true, actionsPosition);

    const wrapper = (
      content: Content<[close: (ev?: FDialogBodyEventData) => void]>,
    ) => {
      if (typeof content === "function") {
        return (ctx: Context) => content(ctx, this.$fire);
      }
      return content;
    };

    bodyStyles.root();
    _._div({}, _ => {
      titleStyles.root();
      _._div({}, title);

      if (closeButton) {
        titleStyles.action();
        _._div({}, _ => {
          titleStyles.closeButton();
          _._button(
            {
              type: "button",
              onclick: this.$fireWith(fromCloseButtonSym),
            },
            _ => _.fiDismiss20Regular(),
          );
        });
      }

      contentStyles.root();
      _._div({}, wrapper(content));

      if (actions !== undefined) {
        actionsStyles.root();
        _._div({}, wrapper(actions));
      }
    });
  };
};
