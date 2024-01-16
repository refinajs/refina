import "@refina/fluentui-icons/chevronRight.ts";
import { Content } from "refina";
import FluentUI from "../../plugin";
import headerStyles from "./header.styles";
import itemStyles from "./item.styles";

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
    this.$_status ??= defaultOpen;

    itemStyles.root(_);
    _._div({}, _ => {
      headerStyles.root(disabled)(_);
      _._div({}, _ => {
        headerStyles.button(disabled)(_);
        _._button(
          {
            onclick: () => {
              if (disabled) return;
              this.$status = !this.$status;
            },
          },
          _ => {
            headerStyles.expandIcon(_);
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
