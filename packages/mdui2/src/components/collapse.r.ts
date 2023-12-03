import {
  Content,
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdCollapse")
export class MdCollapse extends TriggerComponent<
  boolean,
  {
    icon: string;
  }
> {
  collapseRef = ref<HTMLElementComponent<"mdui-collapse">>();
  main(
    _: Context,
    header: D<Content>,
    body: D<Content>,
    disabled: D<boolean> = false,
  ): void {
    _.$ref(this.collapseRef) &&
      _._mdui_collapse(
        {
          disabled: getD(disabled),
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
                  icon: this.$props.icon,
                },
                header,
              );
              if (this.$props.icon) {
                _.$css`margin-left: 2.5rem`;
              }
              _._div({}, _ => _._mdui_list_item({}, body));
            },
          ),
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdCollapse: MdCollapse;
  }
}
