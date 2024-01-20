import { Content } from "refina";
import FluentUI from "../../plugin";
import useStyles from "./styles";

declare module "refina" {
  interface Components {
    fPortal(inner: Content): void;
  }
}
FluentUI.outputComponents.fPortal = function (_) {
  return inner => {
    const styles = useStyles();
    _.portal(_ => styles.root() && _._div({}, inner));
  };
};
