import { Content, TriggerComponent, _, byIndex } from "refina";

export class MdSegmentedButton extends TriggerComponent {
  icons?: (string | undefined)[];
  endIcons?: (string | undefined)[];
  $main(
    contents: Content[],
    disabled: readonly boolean[] | boolean = false,
  ): this is {
    $ev: number;
  } {
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
              icon: this.icons?.[index],
              endIcon: this.endIcons?.[index],
              onclick: this.$fireWith(index),
            },
            content,
          ),
        ),
    );
    return this.$fired;
  }
}
