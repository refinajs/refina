import { Content, TriggerComponent, _, elementRef } from "refina";

export class MdCollapse extends TriggerComponent {
  icon?: string;
  collapseRef = elementRef<"mdui-collapse">();
  $main(
    header: Content,
    body: Content,
    disabled = false,
  ): this is {
    $ev: boolean;
  } {
    _.$ref(this.collapseRef);
    _._mdui_collapse(
      {
        disabled,
        accordion: true,
        onchange: () => {
          this.$fire(
            (this.collapseRef.current!.node.value as string[]).length > 0,
          );
        },
      },
      _ =>
        _._mdui_collapse_item(
          {
            value: "item",
          },
          () => {
            _._mdui_list_item(
              {
                slot: "header",
                icon: this.icon,
              },
              header,
            );
            if (this.icon) {
              _.$css`margin-left: 2.5rem`;
            }
            _._div({}, _ => _._mdui_list_item({}, body));
          },
        ),
    );
    return this.$fired;
  }
}
