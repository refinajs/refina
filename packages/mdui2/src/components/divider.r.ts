import { ComponentContext, OutputComponent } from "refina";
import MdUI2 from "../plugin";

@MdUI2.outputComponent("mdDivider")
export class MdDivider extends OutputComponent {
  main(_: ComponentContext): void {
    _._mdui_divider();
  }
}

@MdUI2.outputComponent("mdVerticalDivider")
export class MdVerticalDivider extends OutputComponent {
  main(_: ComponentContext): void {
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
