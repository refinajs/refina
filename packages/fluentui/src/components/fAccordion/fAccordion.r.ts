import "@refina/fluentui-icons/chevronRight.r.ts";
import { ComponentContext, Content, D, StatusComponent, getD } from "refina";
import FluentUI from "../../plugin";
import headerStyles from "./header.styles";
import itemStyles from "./item.styles";

@FluentUI.statusComponent("fAccordion")
export class FAccordion extends StatusComponent {
  main(_: ComponentContext<this>, header: D<Content>, disabled: D<boolean> = false): void {
    const disabledValue = getD(disabled);

    itemStyles.root(_);
    _._div({}, () => {
      headerStyles.root(disabledValue)(_);
      _._div({}, () => {
        headerStyles.button(disabledValue)(_);
        _._button(
          {
            onclick: () => {
              if (disabledValue) return;
              this.$toggle();
            },
          },
          () => {
            headerStyles.expandIcon(_);
            _._span({}, () => {
              _.$css` transform: rotate(${this.$status ? 90 : 0}deg)`;
              _.fiChevronRightRegular();
            });

            _.embed(header);
          },
        );
      });
    });
  }
}

declare module "refina" {
  interface StatusComponents {
    fAccordion: FAccordion;
  }
}
