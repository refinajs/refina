import { FiChevronRight16Regular } from "@refina/fluentui-icons/chevronRight";
import { Content, TriggerComponent, _, byIndex } from "refina";
import { FSubtleButton } from "../button";
import useButtonStyles from "./button.styles";
import useDividerStyles from "./divider.styles";
import useItemStyles from "./item.styles";
import useStyles from "./styles";

export class FBreadcrumb extends TriggerComponent {
  $main(
    items: Content[],
    disabled: number[] = [],
  ): this is {
    $ev: number;
  } {
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
              _(FSubtleButton)(item, disabled.includes(index)) &&
                !isLast &&
                this.$fire(index);
            });

            if (!isLast) {
              dividerStyles.root();
              _._li({}, _ => _(FiChevronRight16Regular)());
            }
          }),
        ),
    );
    return this.$fired;
  }
}
