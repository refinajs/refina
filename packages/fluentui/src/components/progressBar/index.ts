import { Component, _ } from "refina";
import useStyles from "./styles";
import { FProgressBarColor, FProgressBarValue } from "./types";

export class FProgressBar extends Component {
  $main(value: FProgressBarValue, color?: FProgressBarColor): void {
    const styles = useStyles(value, color);

    styles.root();
    _._div({}, _ => {
      styles.bar();
      if (value !== "indertermine")
        _.$css(`width: ${Math.min(100, Math.max(0, value * 100))}%`);
      _._div();
    });
  }
}

export * from "./types";
