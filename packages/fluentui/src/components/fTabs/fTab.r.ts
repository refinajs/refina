import { Content, D, HTMLElementComponent, getD, ref } from "refina";
import { TriggerComponent, TriggerComponentContext, triggerComponent } from "refina";
import styles from "./fTab.styles";

@triggerComponent("fTab")
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
