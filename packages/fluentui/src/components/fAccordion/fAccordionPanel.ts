import { Content, D } from "refina";
import FluentUI from "../../plugin";
import styles from "./panel.styles";

declare module "refina" {
  interface Components {
    fAccordionPanel(inner: D<Content>): void;
  }
}
FluentUI.outputComponents.fAccordionPanel = function (_) {
  return inner => {
    styles.root(_);
    _._div({}, inner);
  };
};
