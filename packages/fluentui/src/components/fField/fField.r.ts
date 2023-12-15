import "@refina/fluentui-icons/checkmarkCircle.r.ts";
import "@refina/fluentui-icons/errorCircle.r.ts";
import "@refina/fluentui-icons/warning.r.ts";
import { Content, Context, D, View, getD } from "refina";
import FluentUI from "../../plugin";
import "../fLabel";
import styles from "./fField.styles";
import type { FieldValidationState } from "./fField.types";

const validationMessageIcons = {
  error: (_: Context) => _.fiErrorCircle12Filled(),
  warning: (_: Context) => _.fiWarning12Filled(),
  success: (_: Context) => _.fiCheckmarkCircle12Filled(),
  none: () => {},
} satisfies Record<FieldValidationState, View>;

declare module "refina" {
  interface Components {
    fField(
      inner: D<Content>,
      label: D<Content>,
      required?: D<boolean | Content>,
      state?: D<FieldValidationState>,
      validationMessage?: D<Content>,
    ): void;
  }
}
FluentUI.outputComponents.fField = function (_) {
  return (inner, label, required, state = "none", validationMessage) => {
    const stateValue = getD(state);

    styles.root(_);
    _._div({}, _ => {
      styles.label(_);
      _.fLabel(label, required);

      _.embed(inner);

      if (validationMessage) {
        styles.validationMessage(
          stateValue === "error",
          stateValue !== "none",
        )(_);
        _._div({}, _ => {
          styles.validationMessageIcon(stateValue)(_);
          _.embed(validationMessageIcons[stateValue]);

          _.embed(validationMessage);
        });
      }
    });
  };
};
