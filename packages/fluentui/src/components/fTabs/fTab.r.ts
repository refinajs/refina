import { ComponentContext, Content, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./fTab.styles";

@FluentUI.triggerComponent("fTab")
export class FTab extends TriggerComponent<void> {
  buttonRef = ref<HTMLElementComponent<"button">>();
  main(
    _: ComponentContext,
    selected: D<boolean>,
    content: D<Content>,
    disabled: D<boolean> = false,
    animating: boolean = false,
  ): void {
    const selectedValue = getD(selected),
      disabledValue = getD(disabled);
    styles.root(disabledValue, selectedValue, animating, false)(_);
    _.$ref(this.buttonRef) &&
      _._button(
        {
          onclick: this.$fireWith(),
          disabled: disabledValue,
        },
        _ => {
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
