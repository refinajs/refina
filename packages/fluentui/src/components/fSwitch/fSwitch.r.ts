import "@refina/fluentui-icons/circle.r.ts";
import { ComponentContext, D, DOMElementComponent, TriggerComponent, getD, ref } from "refina";
import FluentUI from "../../plugin";
import styles from "./fSwitch.styles";

@FluentUI.triggerComponent("fSwitch")
export class FSwitch extends TriggerComponent<boolean> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(_: ComponentContext<this>, label: D<string>, state: D<boolean>, disabled: D<boolean> = false) {
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
        _.$ref(this.inputRef) &&
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
  }
}

declare module "refina" {
  interface TriggerComponents {
    fSwitch: FSwitch;
  }
}
