import { Component, Content, _ } from "refina";
import useStyles from "./styles";

export class FPortal extends Component {
  $main(inner: Content): void {
    const styles = useStyles();
    _.portal(_ => styles.root() && _._div({}, inner));
  }
}
