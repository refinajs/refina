import { ButtonIcon } from "mdui";
import { TriggerComponent, _ } from "refina";

export type MdIconButtonVariant = ButtonIcon["variant"];

export class MdIconButton extends TriggerComponent<void> {
  variant: MdIconButtonVariant = "standard";
  $main(
    icon: string,
    disabled = false,
    variant = "standard",
  ): this is {
    $ev: void;
  } {
    _._mdui_button_icon({
      icon,
      disabled,
      onclick: this.$fireWith(),
      variant: this.variant,
    });
    return this.$fired;
  }
}

export class MdFilledIconButton extends MdIconButton {
  variant = "filled" as const;
}

export class MdTonalIconButton extends MdIconButton {
  variant = "tonal" as const;
}

export class MdOutlinedIconButton extends MdIconButton {
  variant = "outlined" as const;
}
