import { Fab } from "mdui";
import { Content } from "refina";
import MdUI from "../plugin";

export type FabVariant = Fab["variant"];

declare module "refina" {
  interface Components {
    mdFab(
      icon: string,
      disabled?: boolean,
      extendedContent?: Content | undefined,
      varient?: FabVariant,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdFab = function (_) {
  return (
    icon,
    disabled = false,
    extendedContent = undefined,
    varient = "primary",
  ) => {
    _._mdui_fab(
      {
        icon,
        disabled,
        extended: extendedContent !== undefined,
        onclick: this.$fireWith(),
        variant: varient,
      },
      extendedContent,
    );
  };
};
