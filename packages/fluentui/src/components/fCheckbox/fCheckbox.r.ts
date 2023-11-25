import "@refina/fluentui-icons/checkmark.r.ts";
import "@refina/fluentui-icons/square.r.ts";
import {
  ComponentContext,
  D,
  DOMElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import "../fLabel";
import styles from "./fCheckbox.styles";

export type FCheckboxState = true | false | "mixed";

@FluentUI.triggerComponent("fCheckbox")
export class FCheckbox extends TriggerComponent<boolean> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(
    _: ComponentContext,
    label: D<string>,
    checked: D<FCheckboxState> = this.inputRef.current?.node.checked ?? false,
    disabled: D<boolean> = false,
  ) {
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
        _.$ref(this.inputRef) &&
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
  }
}

declare module "refina" {
  interface TriggerComponents {
    fCheckbox: FCheckbox;
  }
}
