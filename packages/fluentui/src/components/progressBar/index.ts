import FluentUI from "../../plugin";
import useStyles from "./styles";
import { FProgressBarColor, FProgressBarValue } from "./types";

declare module "refina" {
  interface Components {
    fProgressBar(value: FProgressBarValue, color?: FProgressBarColor): void;
  }
}
FluentUI.outputComponents.fProgressBar = function (_) {
  return (value, color) => {
    const styles = useStyles(value, color);

    styles.root();
    _._div({}, _ => {
      styles.bar();
      if (value !== "indertermine")
        _.$css(`width: ${Math.min(100, Math.max(0, value * 100))}%`);
      _._div();
    });
  };
};

export * from "./types";
