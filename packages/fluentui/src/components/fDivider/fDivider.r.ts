import { Content, D, OutputComponent, OutputComponentContext, getD, outputComponent } from "refina";
import styles from "./fDivider.styles";
import { DividerContentAlignment } from "./types";

@outputComponent("fDivider")
export class FDivider extends OutputComponent {
  main(
    _: OutputComponentContext<this>,
    inner: D<Content | undefined>,
    alignContent: D<DividerContentAlignment> = "center",
  ): void {
    const innerValue = getD(inner);
    styles.root(getD(alignContent), false, innerValue == undefined)(_);
    _._div({}, () => styles.wrapper(_) && _._div({}, innerValue));
  }
}

declare module "refina" {
  interface OutputComponents {
    fDivider: FDivider;
  }
}