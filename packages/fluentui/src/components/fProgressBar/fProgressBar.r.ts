import { D, OutputComponent, OutputComponentContext, getD, outputComponent } from "refina";
import styles from "./fProgressBar.styles";
import { ProgressBarColor, ProgressBarValue } from "./types";

@outputComponent("fProgressBar")
export class FProgressBar extends OutputComponent {
  main(_: OutputComponentContext<this>, value: D<ProgressBarValue>, color?: ProgressBarColor): void {
    const valueValue = getD(value);
    styles.root(_);
    _._div({}, () => {
      styles.bar(valueValue, getD(color))(_);
      if (valueValue !== "indertermine") _.$css(`width: ${Math.min(100, Math.max(0, valueValue * 100))}%`);
      _._div();
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    fProgressBar: FProgressBar;
  }
}
