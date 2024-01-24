import { Button } from "mdui";
import { Content, TriggerComponent, _ } from "refina";

export class MdButton extends TriggerComponent<void> {
  variant: Button["variant"] = "filled";
  $main(
    inner: Content,
    disabled: boolean = false,
  ): this is {
    $ev: void;
  } {
    _._mdui_button(
      {
        disabled,
        onclick: this.$fireWith(),
        variant: this.variant,
      },
      inner,
    );
    return this.$fired;
  }
}

export class MdTonalButton extends MdButton {
  variant = "tonal" as const;
}

export class MdOutlinedButton extends MdButton {
  variant = "outlined" as const;
}

export class MdTextButton extends MdButton {
  variant = "text" as const;
}
