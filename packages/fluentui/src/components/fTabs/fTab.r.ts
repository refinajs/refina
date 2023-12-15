import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fTab.styles";

declare module "refina" {
  interface Components {
    fTab(
      selected: D<boolean>,
      content: D<Content>,
      disabled?: D<boolean>,
      animating?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fTab = function (_) {
  return (selected, content, disabled = false, animating = false) => {
    const selectedValue = getD(selected),
      disabledValue = getD(disabled);
    styles.root(disabledValue, selectedValue, animating, false)(_);
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
  };
};
