import { Content, TriggerComponent, _ } from "refina";

export class MdTooltip extends TriggerComponent {
  $main(
    text: string,
    children: Content,
  ): this is {
    $ev: boolean;
  } {
    _._mdui_tooltip(
      {
        content: text,
      },
      children,
      {
        open: this.$fireWith(true),
        close: this.$fireWith(false),
      },
    );
    return this.$fired;
  }
}
