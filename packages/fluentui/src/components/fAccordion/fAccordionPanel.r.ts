import { ComponentContext, Content, D, OutputComponent } from "refina";
import FluentUI from "../../plugin";
import styles from "./panel.styles";

@FluentUI.outputComponent("fAccordionPanel")
export class FAccordionPanel extends OutputComponent {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    styles.root(_);
    _._div({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    fAccordionPanel: FAccordionPanel;
  }
}
