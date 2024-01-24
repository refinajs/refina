import { Content, TriggerComponent, _ } from "refina";

export class MdTooltip extends TriggerComponent {
  $main(
    text: string,
    inner: Content,
  ): this is {
    $ev: boolean;
  } {
    _._mdui_tooltip(
      {
        content: text,
      },
      inner,
      {
        open: this.$fireWith(true),
        close: this.$fireWith(false),
      },
    );
    return this.$fired;
  }
}
