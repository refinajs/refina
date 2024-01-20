import "@refina/fluentui-icons/checkmarkCircle.ts";
import "@refina/fluentui-icons/errorCircle.ts";
import "@refina/fluentui-icons/warning.ts";
import { Content, Context, View } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";
import type { FFieldValidationState } from "./types";

const validationMessageIcons = {
  error: (_: Context) => _.fiErrorCircle12Filled(),
  warning: (_: Context) => _.fiWarning12Filled(),
  success: (_: Context) => _.fiCheckmarkCircle12Filled(),
  none: () => {},
} satisfies Record<FFieldValidationState, View>;

declare module "refina" {
  interface Components {
    fField(
      inner: Content,
      label: Content,
      required?: boolean | Content,
      state?: FFieldValidationState,
      validationMessage?: Content,
    ): void;
  }
}
FluentUI.outputComponents.fField = function (_) {
  return (inner, label, required, state = "none", validationMessage) => {
    const styles = useStyles(state, state === "error", state !== "none");

    styles.root();
    _._div({}, _ => {
      styles.label();
      _.fLabel(label, required);

      _.embed(inner);

      if (validationMessage) {
        styles.validationMessage();
        _._div({}, _ => {
          styles.validationMessageIcon();
          _.embed(validationMessageIcons[state]);

          _.embed(validationMessage);
        });
      }
    });
  };
};

export * from "./types";
