import "@refina/fluentui-icons/checkmark.ts";
import "@refina/fluentui-icons/square.ts";
import { DOMElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";
import { FCheckboxState } from "./types";

declare module "refina" {
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
FluentUI.triggerComponents.fCheckbox = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (
    label,
    checked = inputRef.current?.node.checked ?? false,
    disabled = false,
  ) => {
    const checkedValue = valueOf(checked);

    const styles = useStyles(disabled, checkedValue);

    styles.root();
    _._span(
      {
        onclick: () => {
          const newState = checkedValue !== true;
          _.$updateModel(checked, newState);
          this.$fire(newState);
        },
      },
      _ => {
        styles.input();
        _.$ref(inputRef) &&
          _._input({
            type: "checkbox",
            checked: checkedValue === true,
          });

        styles.indicator();
        _._div({}, _ => {
          if (checkedValue === "mixed") {
            _.fiSquare12Filled();
          } else if (checkedValue === true) {
            _.fiCheckmark12Filled();
          }
        });

        styles.label();
        _.fLabel(label, false, disabled);
      },
    );
  };
};

export * from "./types";
export * from "./utils";
