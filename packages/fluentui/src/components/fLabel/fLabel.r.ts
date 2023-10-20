import { ComponentContext, Content, D, OutputComponent, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fLable.styles";

@FluentUI.outputComponent("fLabel")
export class FLabel extends OutputComponent {
  main(
    _: ComponentContext<this>,
    content: D<Content>,
    required: D<Content | boolean> = false,
    disabled: D<boolean> = false,
  ): void {
    const requiredValue = getD(required),
      disabledValue = getD(disabled);
    const requiredContent = typeof requiredValue === "boolean" ? "*" : requiredValue;
    styles.root(disabledValue)(_);
    _._label({}, _ => {
      _._span({}, content);
      if (requiredValue !== false) {
        styles.required(disabledValue)(_);
        _._span({}, requiredContent);
      }
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    fLabel: FLabel;
  }
}
