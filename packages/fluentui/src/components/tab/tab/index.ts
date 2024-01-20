import { Content } from "refina";
import FluentUI from "../../../plugin";
import useStyles from "./styles";

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
    const styles = useStyles(disabled, selected, animating, false, false);

    styles.root();
    _._button(
      {
        onclick: this.$fireWith(),
        disabled: disabled,
      },
      _ => {
        styles.content();
        _._span({}, content);

        styles.contentReservedSpace();
        _._span({}, content);
      },
    );
  };
};
