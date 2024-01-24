import { Fab } from "mdui";
import { Content, TriggerComponent, _ } from "refina";

export type MdFabVariant = Fab["variant"];

export class MdFab extends TriggerComponent<void> {
  varient: MdFabVariant = "primary";
  $main(
    icon: string,
    disabled = false,
    extendedContent: Content | undefined = undefined,
  ): this is {
    $ev: void;
  } {
    _._mdui_fab(
      {
        icon,
        disabled,
        extended: extendedContent !== undefined,
        onclick: this.$fireWith(),
        variant: this.varient,
      },
      extendedContent,
    );
    return this.$fired;
  }
}
