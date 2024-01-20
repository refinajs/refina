import { Content } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";

declare module "refina" {
  interface Components {
    fLabel(
      content: Content,
      required?: Content | boolean,
      disabled?: boolean,
    ): void;
  }
}
FluentUI.outputComponents.fLabel = function (_) {
  return (content, required = false, disabled = false) => {
    const requiredContent = typeof required === "boolean" ? "*" : required;

    const styles = useStyles(disabled);

    styles.root();
    _._label({}, _ => {
      _._span({}, content);
      if (required !== false) {
        styles.required();
        _._span({}, requiredContent);
      }
    });
  };
};
