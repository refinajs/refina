import { FiCircleFilled } from "@refina/fluentui-icons/circle";
import { Model, TriggerComponent, _, elementRef, valueOf } from "refina";
import { FLabel } from "../label";
import useStyles from "./styles";

export class FSwitch extends TriggerComponent {
  inputRef = elementRef<"input">();
  $main(
    label: string,
    state: Model<boolean>,
    disabled = false,
  ): this is {
    $ev: boolean;
  } {
    const stateValue = valueOf(state);

    const styles = useStyles();

    styles.root();
    _._div(
      {
        onclick: () => {
          if (!disabled) {
            const newState = !stateValue;
            this.$updateModel(state, newState);
            this.$fire(newState);
          }
        },
      },
      _ => {
        styles.input();
        _.$ref(this.inputRef);
        _._input({
          type: "checkbox",
          disabled: disabled,
          checked: stateValue,
        });
        styles.indicator();
        _._div({}, _ => _(FiCircleFilled)());
        styles.label();
        _(FLabel)(label);
      },
    );
    return this.$fired;
  }
}
