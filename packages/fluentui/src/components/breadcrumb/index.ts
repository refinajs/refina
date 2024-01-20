import "@refina/fluentui-icons/chevronRight";
import { Content, byIndex } from "refina";
import FluentUI from "../../plugin";
import useButtonStyles from "./button.styles";
import useDividerStyles from "./divider.styles";
import useItemStyles from "./item.styles";
import useStyles from "./styles";

declare module "refina" {
  interface Components {
    fBreadcrumb(
      items: Content[],
      disabled?: number[],
    ): this is {
      $ev: number;
    };
  }
}

FluentUI.triggerComponents.fBreadcrumb = function (_) {
  return (items: Content[], disabled: number[] = []) => {
    const styles = useStyles();
    const itemStyles = useItemStyles();
    const dividerStyles = useDividerStyles();

    styles.root();
    _._nav(
      {},
      _ =>
        styles.list() &&
        _._ol({}, _ =>
          _.for(items, byIndex, (item, index) => {
            const isLast = index === items.length - 1;

            const buttonStyles = useButtonStyles(isLast);

            itemStyles.root();
            _._li({}, _ => {
              buttonStyles.root();
              _.fButton(item, disabled.includes(index), "rounded", "subtle") &&
                !isLast &&
                this.$fire(index);
            });

            if (!isLast) {
              dividerStyles.root();
              _._li({}, _ => _.fiChevronRight16Regular());
            }
          }),
        ),
    );
  };
};
