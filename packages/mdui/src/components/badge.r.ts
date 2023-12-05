import { Content, Context, D, OutputComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdBadge")
export class MdBadge extends OutputComponent {
  main(_: Context, inner?: D<Content | undefined>): void {
    const innerValue = getD(inner);
    if (innerValue === undefined) {
      _._mdui_badge({
        variant: "small",
      });
    } else {
      _._mdui_badge(
        {
          variant: "large",
        },
        innerValue,
      );
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    mdBadge: MdBadge;
  }
}
