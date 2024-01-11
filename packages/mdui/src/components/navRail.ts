import { Content, HTMLElementComponent, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdNavRailProps: {
      contained: boolean;
    };
    mdNavRail<Value extends string>(
      items: readonly [value: Value, iconName?: string][],
      contentOverride?: Partial<Record<Value, Content>>,
      bottomSlot?: Content,
    ): Value;
  }
}
MdUI.statusComponents.mdNavRail = function (_) {
  const navRailRef = ref<HTMLElementComponent<"mdui-navigation-rail">>();
  return (items, contentOverride = {}, bottomSlot) => {
    const firstItem = items[0];
    this.$_status ??= Array.isArray(firstItem) ? firstItem[0] : firstItem;

    _.$ref(navRailRef) &&
      _._mdui_navigation_rail(
        {
          value: this.$status,
          contained: this.$props.contained,
          onchange: () => {
            this.$status = navRailRef.current!.node.value!;
          },
        },
        _ => {
          _.for(items, "0", item => {
            const [value, icon] = item;
            _._mdui_navigation_rail_item(
              {
                value,
                icon,
              },
              contentOverride[value] ?? value,
            );
          });

          if (bottomSlot) {
            _._div({ slot: "bottom" }, bottomSlot);
          }
        },
      );
  };
};
