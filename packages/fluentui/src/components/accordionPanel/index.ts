import { Content } from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";

declare module "refina" {
  interface Components {
    fAccordionPanel(inner: Content): void;
  }
}
FluentUI.outputComponents.fAccordionPanel = function (_) {
  return inner => {
    styles.root(_);
    _._div({}, inner);
  };
};
