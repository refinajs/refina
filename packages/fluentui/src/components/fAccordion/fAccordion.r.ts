import "@refina/fluentui-icons/chevronRight.r.ts";
import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import headerStyles from "./header.styles";
import itemStyles from "./item.styles";

declare module "refina" {
  interface Components {
    fAccordion(
      header: D<Content>,
      disabled?: D<boolean>,
      defaultOpen?: D<boolean>,
    ): boolean;
  }
}
FluentUI.statusComponents.fAccordion = function (_) {
  return (header, disabled = false, defaultOpen = false) => {
    this.$_status ??= getD(defaultOpen);

    const disabledValue = getD(disabled);

    itemStyles.root(_);
    _._div({}, _ => {
      headerStyles.root(disabledValue)(_);
      _._div({}, _ => {
        headerStyles.button(disabledValue)(_);
        _._button(
          {
            onclick: () => {
              if (disabledValue) return;
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
