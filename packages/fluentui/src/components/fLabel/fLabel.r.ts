import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fLable.styles";

declare module "refina" {
  interface Components {
    fLabel(
      content: D<Content>,
      required?: D<Content | boolean>,
      disabled?: D<boolean>,
    ): void;
  }
}
FluentUI.outputComponents.fLabel = function (_) {
  return (content, required = false, disabled = false) => {
    const requiredValue = getD(required),
      disabledValue = getD(disabled);
    const requiredContent =
      typeof requiredValue === "boolean" ? "*" : requiredValue;
    styles.root(disabledValue)(_);
    _._label({}, _ => {
      _._span({}, content);
      if (requiredValue !== false) {
        styles.required(disabledValue)(_);
        _._span({}, requiredContent);
      }
    });
  };
};
