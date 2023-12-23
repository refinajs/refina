import "@refina/fluentui-icons/checkmark.ts";
import "@refina/fluentui-icons/square.ts";
import { D, DOMElementComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import "../fLabel";
import styles from "./fCheckbox.styles";

export type FCheckboxState = true | false | "mixed";

declare module "refina" {
  interface Components {
    fCheckbox(
      label: D<string>,
      checked?: D<FCheckboxState>,
      disabled?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fCheckbox = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (
    label,
    checked = inputRef.current?.node.checked ?? false,
    disabled = false,
  ) => {
    const checkedValue = getD(checked),
      disabledValue = getD(disabled);

    styles.root(disabledValue, checkedValue)(_);
    _._span(
      {
        onclick: () => {
          const newState = checkedValue !== true;
          _.$setD(checked, newState);
          this.$fire(newState);
        },
      },
      _ => {
        styles.input(_);
        _.$ref(inputRef) &&
          _._input({
            type: "checkbox",
            checked: checkedValue === true,
          });

        styles.indicator(_);
        _._div({}, _ => {
          if (checkedValue === "mixed") {
            _.fiSquare12Filled();
          } else if (checkedValue === true) {
            _.fiCheckmark12Filled();
          }
        });

        styles.label(_);
        _.fLabel(label, false, disabled);
      },
    );
  };
};
