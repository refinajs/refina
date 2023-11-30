import {
  Content,
  Context,
  D,
  DReadonlyArray,
  TriggerComponent,
  byIndex,
  getD,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdSegmentedButton")
export class MdSegmentedButton extends TriggerComponent<
  number,
  {
    icons: (string | undefined)[];
    endIcons: (string | undefined)[];
  }
> {
  main(
    _: Context,
    contents: D<Content>[],
    disabled: DReadonlyArray<boolean> | D<boolean> = false,
  ): void {
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
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdSegmentedButton: MdSegmentedButton;
  }
}
