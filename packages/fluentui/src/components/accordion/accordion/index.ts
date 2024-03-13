import { FiChevronRightRegular } from "@refina/fluentui-icons/chevronRight";
import { Component, Content, _ } from "refina";
import useHeaderStyles from "./header.styles";
import useItemStyles from "./item.styles";

export class FAccordion extends Component {
  status: boolean;
  $main(header: Content, disabled = false, defaultOpen = false): boolean {
    const headerStyles = useHeaderStyles(disabled);
    const itemStyles = useItemStyles();

    this.status ??= defaultOpen;

    itemStyles.root();
    _._div({}, _ => {
      headerStyles.root();
      _._div({}, _ => {
        headerStyles.button();
        _._button(
          {
            onclick: () => {
              if (disabled) return;
              this.status = !this.status;
              this.$update();
            },
          },
          _ => {
            headerStyles.expandIcon();
            _._span({}, _ => {
              _.$css` transform: rotate(${this.status ? 90 : 0}deg)`;
              _(FiChevronRightRegular)();
            });

            _.embed(header);
          },
        );
      });
    });
    return this.status;
  }
}
