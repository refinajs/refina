import { Component, Content, _ } from "refina";
import useStyles from "./styles";
import { DividerContentAlignment } from "./types";

export class FDivider extends Component {
  $main(
    children: Content | undefined,
    alignContent: DividerContentAlignment = "center",
  ): void {
    const styles = useStyles(alignContent, false, children == undefined);

    styles.root();
    _._div({}, _ => styles.wrapper() && _._div({}, children));
  }
}

export * from "./types";
