import { Content, D, DReadonlyArray, byIndex, getD } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdSegmentedButtonProps: {
      icons: (string | undefined)[];
      endIcons: (string | undefined)[];
    };
    mdSegmentedButton(
      contents: D<Content>[],
      disabled?: DReadonlyArray<boolean> | D<boolean>,
    ): this is {
      $ev: number;
    };
  }
}
MdUI.triggerComponents.mdSegmentedButton = function (_) {
  return (
    contents: D<Content>[],
    disabled: DReadonlyArray<boolean> | D<boolean> = false,
  ) => {
    const disabledValue = getD(disabled);
    const groupDisabled = disabledValue === true;
    const optionsDisabled =
      typeof disabledValue === "boolean" ? [] : disabledValue.map(getD);

    _._mdui_segmented_button_group(
      {
        disabled: groupDisabled,
      },
      _ =>
        _.for(contents, byIndex, (content, index) =>
          _._mdui_segmented_button(
            {
              disabled: optionsDisabled[index],
              icon: this.$props.icons?.[index],
              endIcon: this.$props.endIcons?.[index],
              onclick: this.$fireWith(index),
            },
            content,
          ),
        ),
    );
  };
};
