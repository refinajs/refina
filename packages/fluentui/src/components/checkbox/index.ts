import { FiCheckmark12Filled } from "@refina/fluentui-icons/checkmark";
import { FiSquare12Filled } from "@refina/fluentui-icons/square";
import { Model, TriggerComponent, _, elementRef, unwrap } from "refina";
import { FLabel } from "../label";
import useStyles from "./styles";
import { FCheckboxState } from "./types";

namespace todo {
  interface Components {
    fCheckbox(
      label: string,
      checked?: Model<FCheckboxState>,
      disabled?: boolean,
    ): this is {
      $ev: boolean;
    };
  }
}
export class FCheckbox extends TriggerComponent {
  inputRef = elementRef<"input">();
  $main(
    label: string,
    checked: Model<FCheckboxState> = this.inputRef.current?.node.checked ??
      false,
    disabled = false,
  ): this is {
    $ev: boolean;
  } {
    const checkedValue = unwrap(checked);

    const styles = useStyles(disabled, checkedValue);

    styles.root();
    _._span(
      {
        onclick: () => {
          const newState = checkedValue !== true;
          this.$updateModel(checked, newState);
          this.$fire(newState);
        },
      },
      _ => {
        styles.input();
        _.$ref(this.inputRef);
        _._input({
          type: "checkbox",
          checked: checkedValue === true,
        });

        styles.indicator();
        _._div({}, _ => {
          if (checkedValue === "mixed") {
            _(FiSquare12Filled)();
          } else if (checkedValue === true) {
            _(FiCheckmark12Filled)();
          }
        });

        styles.label();
        _(FLabel)(label, false, disabled);
      },
    );
    return this.$fired;
  }
}

export * from "./types";
export * from "./utils";
