import { ComponentContext, Content, D, OutputComponent, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fDivider.styles";
import { DividerContentAlignment } from "./types";

@FluentUI.outputComponent("fDivider")
export class FDivider extends OutputComponent {
  main(
    _: ComponentContext<this>,
    inner: D<Content | undefined>,
    alignContent: D<DividerContentAlignment> = "center",
  ): void {
    const innerValue = getD(inner);
    styles.root(getD(alignContent), false, innerValue == undefined)(_);
    _._div({}, _ => styles.wrapper(_) && _._div({}, innerValue));
  }
}

declare module "refina" {
  interface OutputComponents {
    fDivider: FDivider;
  }
}
