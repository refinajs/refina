import FluentUI from "../../plugin";
import styles from "./fProgressBar.styles";
import { ProgressBarColor, ProgressBarValue } from "./types";

declare module "refina" {
  interface Components {
    fProgressBar(value: ProgressBarValue, color?: ProgressBarColor): void;
  }
}
FluentUI.outputComponents.fProgressBar = function (_) {
  return (value, color) => {
    styles.root(_);
    _._div({}, _ => {
      styles.bar(value, color)(_);
      if (value !== "indertermine")
        _.$css(`width: ${Math.min(100, Math.max(0, value * 100))}%`);
      _._div();
    });
  };
};
