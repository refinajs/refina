import "@refina/fluentui-icons/chevronRight.ts";
import { Content } from "refina";
import FluentUI from "../../../plugin";
import useHeaderStyles from "./header.styles";
import useItemStyles from "./item.styles";

declare module "refina" {
  interface Components {
    fAccordion(
      header: Content,
      disabled?: boolean,
      defaultOpen?: boolean,
    ): boolean;
  }
}
FluentUI.statusComponents.fAccordion = function (_) {
  return (header, disabled = false, defaultOpen = false) => {
    const headerStyles = useHeaderStyles(disabled);
    const itemStyles = useItemStyles();

    this.$_status ??= defaultOpen;

    itemStyles.root();
    _._div({}, _ => {
      headerStyles.root();
      _._div({}, _ => {
        headerStyles.button();
        _._button(
          {
            onclick: () => {
              if (disabled) return;
              this.$status = !this.$status;
            },
          },
          _ => {
            headerStyles.expandIcon();
            _._span({}, _ => {
              _.$css` transform: rotate(${this.$status ? 90 : 0}deg)`;
              _.fiChevronRightRegular();
            });

            _.embed(header);
          },
        );
      });
    });
  };
};
