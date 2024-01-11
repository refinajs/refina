import { Content, byIndex } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdSegmentedButtonProps: {
      icons: (string | undefined)[];
      endIcons: (string | undefined)[];
    };
    mdSegmentedButton(
      contents: Content[],
      disabled?: readonly boolean[] | boolean,
    ): this is {
      $ev: number;
    };
  }
}
MdUI.triggerComponents.mdSegmentedButton = function (_) {
  return (
    contents: Content[],
    disabled: readonly boolean[] | boolean = false,
  ) => {
    const groupDisabled = disabled === true;
    const optionsDisabled = typeof disabled === "boolean" ? [] : disabled;

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
