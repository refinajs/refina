import {
  Content,
  D,
  DPartialRecord,
  DReadonlyArray,
  HTMLElementComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdNavRailProps: {
      contained: boolean;
    };
    mdNavRail<Value extends string>(
      items: DReadonlyArray<[value: Value, iconName?: string]>,
      contentOverride?: DPartialRecord<Value, Content>,
      bottomSlot?: D<Content>,
    ): Value;
  }
}
MdUI.statusComponents.mdNavRail = function (_) {
  const navRailRef = ref<HTMLElementComponent<"mdui-navigation-rail">>();
  return (items, contentOverride = {}, bottomSlot) => {
    const contentOverrideValue = getD(contentOverride);

    const firstItem = getD(getD(items)[0]);
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
          _.for(
            items,
            item => getD(item)[0],
            item => {
              const [value, icon] = getD(item);
              _._mdui_navigation_rail_item(
                {
                  value,
                  icon,
                },
                contentOverrideValue[value] ?? value,
              );
            },
          );

          if (bottomSlot) {
            _._div({ slot: "bottom" }, bottomSlot);
          }
        },
      );
  };
};
