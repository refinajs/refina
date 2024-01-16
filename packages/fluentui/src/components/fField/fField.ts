import "@refina/fluentui-icons/checkmarkCircle.ts";
import "@refina/fluentui-icons/errorCircle.ts";
import "@refina/fluentui-icons/warning.ts";
import { Content, Context, View } from "refina";
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
      inner: Content,
      label: Content,
      required?: boolean | Content,
      state?: FieldValidationState,
      validationMessage?: Content,
    ): void;
  }
}
FluentUI.outputComponents.fField = function (_) {
  return (inner, label, required, state = "none", validationMessage) => {
    styles.root(_);
    _._div({}, _ => {
      styles.label(_);
      _.fLabel(label, required);

      _.embed(inner);

      if (validationMessage) {
        styles.validationMessage(state === "error", state !== "none")(_);
        _._div({}, _ => {
          styles.validationMessageIcon(state)(_);
          _.embed(validationMessageIcons[state]);

          _.embed(validationMessage);
        });
      }
    });
  };
};
