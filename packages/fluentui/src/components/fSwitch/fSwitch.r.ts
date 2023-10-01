import { D, DOMElementComponent, TriggerComponent, TriggerComponentContext, getD, triggerComponent, ref } from "refina";
import styles from "./fSwitch.styles";
import "@refina/fluentui-icons/circle.r.ts";

@triggerComponent("fSwitch")
export class FSwitch extends TriggerComponent<boolean> {
  inputEl = ref<DOMElementComponent<"input">>();
  main(_: TriggerComponentContext<boolean, this>, label: D<string>, state: D<boolean>, disabled: D<boolean> = false) {
    const stateValue = getD(state),
      disabledValue = getD(disabled);
    styles.root(_);
    _._div(
      {
        onclick: () => {
          if (!disabledValue) {
            const newState = !stateValue;
            _.$setD(state, newState);
            _.$fire(newState);
          }
        },
      },
      () => {
        styles.input(_);
        _.$ref(this.inputEl) &&
          _._input({
            type: "checkbox",
            disabled: disabledValue,
            checked: stateValue,
          });
        styles.indicator(_);
        _._div({}, () => _.fiCircleFilled());
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
