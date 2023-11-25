import "@refina/fluentui-icons/checkmarkCircle.r.ts";
import "@refina/fluentui-icons/errorCircle.r.ts";
import "@refina/fluentui-icons/warning.r.ts";
import {
  ComponentContext,
  Content,
  Context,
  D,
  OutputComponent,
  View,
  getD,
} from "refina";
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

@FluentUI.outputComponent("fField")
export class FField extends OutputComponent {
  main(
    _: ComponentContext,
    inner: D<Content>,
    label: D<Content>,
    required?: D<boolean | Content>,
    state: D<FieldValidationState> = "none",
    validationMessage?: D<Content>,
  ): void {
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
  }
}

declare module "refina" {
  interface OutputComponents {
    fField: FField;
  }
}
