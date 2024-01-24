import { Content, TriggerComponent, _ } from "refina";

export class BasicButton extends TriggerComponent {
  $main(
    inner: Content,
    disabled?: boolean,
  ): this is {
    $ev: MouseEvent;
  } {
    _._button(
      {
        onclick: this.$fire,
        disabled,
        type: "button",
      },
      inner,
    );
    return this.$fired;
  }
}
