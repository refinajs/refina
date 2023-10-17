import { Content, D, HTMLElementComponent, TriggerComponent, TriggerComponentContext, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./fTab.styles";

@FluentUI.triggerComponent("fTab")
export class FTab extends TriggerComponent<void> {
  buttonEl = ref<HTMLElementComponent<"button">>();
  main(
    _: TriggerComponentContext<void, this>,
    selected: D<boolean>,
    content: D<Content>,
    disabled: D<boolean> = false,
    animating: boolean = false,
  ): void {
    const selectedValue = getD(selected),
      disabledValue = getD(disabled);
    styles.root(disabledValue, selectedValue, animating, false)(_);
    _.$ref(this.buttonEl) &&
      _._button(
        {
          onclick: _.$fireWith(),
          disabled: disabledValue,
        },
        (_) => {
          styles.content(false, false)(_);
          _._span({}, content);

          styles.contentReservedSpace(false)(_);
          _._span({}, content);
        },
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    fTab: FTab;
  }
}
