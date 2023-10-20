import { ComponentContext, Content, D, OutputComponent } from "refina";
import FluentUI from "../../plugin";
import styles from "./fPortal.styles";

@FluentUI.outputComponent("fPortal")
export class FPortal extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.portal(() => styles.root(_) && _._div({}, inner));
  }
}

declare module "refina" {
  interface OutputComponents {
    fPortal: FPortal;
  }
}
