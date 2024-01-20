import { Content } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";

declare module "refina" {
  interface Components {
    fAccordionPanel(inner: Content): void;
  }
}
FluentUI.outputComponents.fAccordionPanel = function (_) {
  return inner => {
    const styles = useStyles();

    styles.root;
    _._div({}, inner);
  };
};
