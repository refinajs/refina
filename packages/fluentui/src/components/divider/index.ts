import { Content } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";
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
    const styles = useStyles(alignContent, false, inner == undefined);

    styles.root();
    _._div({}, _ => styles.wrapper() && _._div({}, inner));
  };
};

export * from "./types";
