import { Component, Content, _ } from "refina";
import useStyles from "./styles";

export class FAccordionPanel extends Component {
  $main(children: Content): void {
    const styles = useStyles();

    styles.root;
    _._div({}, children);
  }
}
