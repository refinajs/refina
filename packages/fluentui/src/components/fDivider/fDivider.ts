import { Content, D, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fDivider.styles";
import { DividerContentAlignment } from "./types";

declare module "refina" {
  interface Components {
    fDivider(
      inner: D<Content | undefined>,
      alignContent?: D<DividerContentAlignment>,
    ): void;
  }
}
FluentUI.outputComponents.fDivider = function (_) {
  return (inner, alignContent = "center") => {
    const innerValue = getD(inner);
    styles.root(getD(alignContent), false, innerValue == undefined)(_);
    _._div({}, _ => styles.wrapper(_) && _._div({}, innerValue));
  };
};
