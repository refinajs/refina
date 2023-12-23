import { D, getD } from "refina";
import FluentUI from "../../plugin";
import styles from "./fProgressBar.styles";
import { ProgressBarColor, ProgressBarValue } from "./types";

declare module "refina" {
  interface Components {
    fProgressBar(value: D<ProgressBarValue>, color?: ProgressBarColor): void;
  }
}
FluentUI.outputComponents.fProgressBar = function (_) {
  return (value, color) => {
    const valueValue = getD(value);
    styles.root(_);
    _._div({}, _ => {
      styles.bar(valueValue, getD(color))(_);
      if (valueValue !== "indertermine")
        _.$css(`width: ${Math.min(100, Math.max(0, valueValue * 100))}%`);
      _._div();
    });
  };
};
