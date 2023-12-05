import { Fab } from "mdui";
import { Content, Context, D, TriggerComponent, getD } from "refina";
import MdUI from "../plugin";

@MdUI.triggerComponent("mdFab")
export class MdFab extends TriggerComponent<void> {
  varient: Fab["variant"];

  main(
    _: Context,
    icon: D<string>,
    disabled: D<boolean> = false,
    extendedContent: D<Content | undefined> = undefined,
  ): void {
    const extendedContentValue = getD(extendedContent);
    _._mdui_fab(
      {
        icon: getD(icon),
        disabled: getD(disabled),
        extended: extendedContentValue !== undefined,
        onclick: this.$fireWith(),
        variant: this.varient,
      },
      extendedContentValue,
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdFab: MdFab;
  }
}
