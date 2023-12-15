import { Content, D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdCollapseProps: {
      icon: string;
    };
    mdCollapse(
      header: D<Content>,
      body: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdCollapse = function (_) {
  const collapseRef = ref<HTMLElementComponent<"mdui-collapse">>();
  return (header, body, disabled = false) => {
    _.$ref(collapseRef) &&
      _._mdui_collapse(
        {
          disabled: getD(disabled),
          accordion: true,
          onchange: () => {
            this.$fire(
              (collapseRef.current!.node.value as string[]).length > 0,
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
  };
};
