import { Content, TriggerComponent, _ } from "refina";
import useStyles from "./styles";
import { FButtonApperance, FButtonShape } from "./types";

export class FButton extends TriggerComponent {
  shape: FButtonShape = "rounded";
  appearance: FButtonApperance = "secondary";
  $main(
    inner: Content,
    disabled = false,
  ): this is {
    $ev: MouseEvent;
  } {
    const styles = useStyles(
      this.shape,
      this.appearance,
      false,
      disabled,
      false,
    );

    styles.root();
    _._button(
      {
        type: "button",
        disabled,
        onclick: this.$fire,
      },
      inner,
    );
    return this.$fired;
  }
}

export class FCircularButton extends FButton {
  shape = "circular" as const;
}

export class FSquareButton extends FButton {
  shape = "square" as const;
}

export class FPrimaryButton extends FButton {
  appearance = "primary" as const;
}

export class FSecondaryButton extends FButton {
  appearance = "secondary" as const;
}

export class FSubtleButton extends FButton {
  appearance = "subtle" as const;
}

export class FTransparentButton extends FButton {
  appearance = "transparent" as const;
}

export * from "./types";
