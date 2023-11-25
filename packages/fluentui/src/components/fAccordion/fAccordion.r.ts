import "@refina/fluentui-icons/chevronRight.r.ts";
import { ComponentContext, Content, D, ToggleComponent, getD } from "refina";
import FluentUI from "../../plugin";
import headerStyles from "./header.styles";
import itemStyles from "./item.styles";

@FluentUI.statusComponent("fAccordion")
export class FAccordion extends ToggleComponent {
  main(
    _: ComponentContext,
    header: D<Content>,
    disabled: D<boolean> = false,
  ): void {
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
              this.$toggle();
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
  }
}

@FluentUI.statusComponent("fAccordionDefaultOpen")
export class FAccordionDefaultOpen extends FAccordion {
  $_status = true;
}

declare module "refina" {
  interface StatusComponents {
    fAccordion: FAccordion;
    fAccordionDefaultOpen: FAccordionDefaultOpen;
  }
}
