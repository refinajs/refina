import { FiDismiss20Regular } from "@refina/fluentui-icons/dismiss";
import { Content, TriggerComponent, _ } from "refina";
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

export class FDialogBody extends TriggerComponent {
  $main(
    title: Content,
    content: Content<[close: (ev?: FDialogBodyEventData) => void]>,
    actions?: Content<[close: (ev?: FDialogBodyEventData) => void]> | undefined,
    actionsPosition: "start" | "end" = "start",
    closeButton = false,
  ): this is {
    $ev: FDialogBodyEventData;
  } {
    const bodyStyles = useBodyStyles();
    const titleStyles = useTitleStyles(!closeButton);
    const contentStyles = useContentStyles();
    const actionsStyles = useActionsStyles(true, actionsPosition);

    const wrapper = (
      content: Content<[close: (ev?: FDialogBodyEventData) => void]>,
    ) => {
      if (typeof content === "function") {
        return () => content(this.$fire);
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
            _ => _(FiDismiss20Regular)(),
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
    return this.$fired;
  }
}
