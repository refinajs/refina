import { Content, D } from "refina";
import FluentUI from "../../plugin";
import styles from "./fPortal.styles";

declare module "refina" {
  interface Components {
    fPortal(inner: D<Content>): void;
  }
}
FluentUI.outputComponents.fPortal = function (_) {
  return inner => {
    _.portal(_ => styles.root(_) && _._div({}, inner));
  };
};
