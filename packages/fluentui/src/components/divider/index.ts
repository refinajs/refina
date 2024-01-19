import { Content } from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";
import { DividerContentAlignment } from "./types";

declare module "refina" {
  interface Components {
    fDivider(
      inner: Content | undefined,
      alignContent?: DividerContentAlignment,
    ): void;
  }
}
FluentUI.outputComponents.fDivider = function (_) {
  return (inner, alignContent = "center") => {
    styles.root(alignContent, false, inner == undefined)(_);
    _._div({}, _ => styles.wrapper(_) && _._div({}, inner));
  };
};

export * from "./types";
