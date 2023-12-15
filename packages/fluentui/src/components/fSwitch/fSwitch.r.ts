import "@refina/fluentui-icons/circle.r.ts";
import { D, DOMElementComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./fSwitch.styles";

declare module "refina" {
  interface Components {
    fSwitch(
      label: D<string>,
      state: D<boolean>,
      disabled?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fSwitch = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (label, state, disabled = false) => {
    const stateValue = getD(state),
      disabledValue = getD(disabled);
    styles.root(_);
    _._div(
      {
        onclick: () => {
          if (!disabledValue) {
            const newState = !stateValue;
            _.$setD(state, newState);
            this.$fire(newState);
          }
        },
      },
      _ => {
        styles.input(_);
        _.$ref(inputRef) &&
          _._input({
            type: "checkbox",
            disabled: disabledValue,
            checked: stateValue,
          });
        styles.indicator(_);
        _._div({}, _ => _.fiCircleFilled());
        styles.label(_);
        _.fLabel(label);
      },
    );
  };
};
