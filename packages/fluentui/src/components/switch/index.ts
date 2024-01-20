import "@refina/fluentui-icons/circle.ts";
import { DOMElementComponent, Model, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";

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

    const styles = useStyles();

    styles.root();
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
        styles.input();
        _.$ref(inputRef) &&
          _._input({
            type: "checkbox",
            disabled: disabled,
            checked: stateValue,
          });
        styles.indicator();
        _._div({}, _ => _.fiCircleFilled());
        styles.label();
        _.fLabel(label);
      },
    );
  };
};
