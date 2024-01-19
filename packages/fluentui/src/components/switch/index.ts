import "@refina/fluentui-icons/circle.ts";
import { DOMElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";

declare module "refina" {
  interface Components {
    fSwitch(
      label: string,
      state: Model<boolean>,
      disabled?: boolean,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fSwitch = function (_) {
  const inputRef = ref<DOMElementComponent<"input">>();
  return (label, state, disabled = false) => {
    const stateValue = valueOf(state);

    styles.root(_);
    _._div(
      {
        onclick: () => {
          if (!disabled) {
            const newState = !stateValue;
            _.$updateModel(state, newState);
            this.$fire(newState);
          }
        },
      },
      _ => {
        styles.input(_);
        _.$ref(inputRef) &&
          _._input({
            type: "checkbox",
            disabled: disabled,
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
