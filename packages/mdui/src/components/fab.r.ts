import { Fab } from "mdui";
import { Content, D, getD } from "refina";
import MdUI from "../plugin";

export type FabVariant = Fab["variant"];

declare module "refina" {
  interface Components {
    mdFab(
      icon: D<string>,
      disabled?: D<boolean>,
      extendedContent?: D<Content | undefined>,
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
    const extendedContentValue = getD(extendedContent);
    _._mdui_fab(
      {
        icon: getD(icon),
        disabled: getD(disabled),
        extended: extendedContentValue !== undefined,
        onclick: this.$fireWith(),
        variant: varient,
      },
      extendedContentValue,
    );
  };
};
