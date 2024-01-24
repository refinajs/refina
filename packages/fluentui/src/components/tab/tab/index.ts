import { Content, TriggerComponent, _ } from "refina";
import useStyles from "./styles";

export class FTab extends TriggerComponent<void> {
  $main(
    selected: boolean,
    content: Content,
    disabled = false,
    animating = false,
  ): this is {
    $ev: void;
  } {
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
    return this.$fired;
  }
}
