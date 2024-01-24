import { FiCheckmarkCircle12Filled } from "@refina/fluentui-icons/checkmarkCircle";
import { FiErrorCircle12Filled } from "@refina/fluentui-icons/errorCircle";
import { FiWarning12Filled } from "@refina/fluentui-icons/warning";
import { Component, Content, _ } from "refina";
import { FLabel } from "../label";
import useStyles from "./styles";
import type { FFieldValidationState } from "./types";

const validationMessageIcons = {
  error: FiErrorCircle12Filled,
  warning: FiWarning12Filled,
  success: FiCheckmarkCircle12Filled,
};

export class FField extends Component {
  $main(
    inner: Content,
    label: Content,
    required?: boolean | Content,
    state: FFieldValidationState = "none",
    validationMessage?: Content,
  ): void {
    const styles = useStyles(state, state === "error", state !== "none");

    styles.root();
    _._div({}, _ => {
      styles.label();
      _(FLabel)(label, required);

      _.embed(inner);

      if (validationMessage) {
        styles.validationMessage();
        _._div({}, _ => {
          if (state !== "none") {
            styles.validationMessageIcon();
            _(validationMessageIcons[state])();
          }

          _.embed(validationMessage);
        });
      }
    });
  }
}

export * from "./types";
