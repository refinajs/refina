import { Content } from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";

declare module "refina" {
  interface Components {
    fTab(
      selected: boolean,
      content: Content,
      disabled?: boolean,
      animating?: boolean,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fTab = function (_) {
  return (selected, content, disabled = false, animating = false) => {
    styles.root(disabled, selected, animating, false)(_);
    _._button(
      {
        onclick: this.$fireWith(),
        disabled: disabled,
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
