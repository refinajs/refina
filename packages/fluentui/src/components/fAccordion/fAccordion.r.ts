import "@refina/fluentui-icons/chevronRight.r.ts";
import { ComponentContext, Content, D, TriggerComponent, getD } from "refina";
import FluentUI from "../../plugin";
import headerStyles from "./header.styles";
import itemStyles from "./item.styles";
import panelStyles from "./panel.styles";

@FluentUI.triggerComponent("fAccordion")
export class FAccordion extends TriggerComponent<boolean> {
  open: boolean = false;

  main(_: ComponentContext<this>, header: D<Content>, panel: D<Content>, disabled: D<boolean> = false): void {
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
              this.open = !this.open;
              _.$update();
            },
          },
          () => {
            headerStyles.expandIcon(_);
            _._span({}, () => {
              _.$css` transform: rotate(${this.open ? 90 : 0}deg)`;
              _.fiChevronRightRegular();
            });

            _.embed(header);
          },
        );
      });

      if (this.open) {
        panelStyles.root(_);
        _._div({}, panel);
      }
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    fAccordion: FAccordion;
  }
}
