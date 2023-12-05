import { Context, OutputComponent } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdDivider")
export class MdDivider extends OutputComponent {
  main(_: Context): void {
    _._mdui_divider();
  }
}

@MdUI.outputComponent("mdVerticalDivider")
export class MdVerticalDivider extends OutputComponent {
  main(_: Context): void {
    _._mdui_divider({
      vertical: true,
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDivider: MdDivider;
    mdVerticalDivider: MdVerticalDivider;
  }
}
