import { Component, Content, _ } from "refina";
import useStyles from "./styles";

export class FLabel extends Component {
  $main(
    content: Content,
    required: Content | boolean = false,
    disabled = false,
  ): void {
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
  }
}
