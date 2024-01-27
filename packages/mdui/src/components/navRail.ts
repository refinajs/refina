import { Component, Content, _, elementRef } from "refina";

export class MdNavRail extends Component {
  contained?: boolean;
  status: string;
  navRailRef = elementRef<"mdui-navigation-rail">();
  $main<Value extends string>(
    items: readonly [value: Value, iconName?: string][],
    contentOverride: Partial<Record<Value, Content>> = {},
    bottomSlot?: Content,
  ): Value {
    const firstItem = items[0];
    this.status ??= Array.isArray(firstItem) ? firstItem[0] : firstItem;

    _.$ref(this.navRailRef);
    _._mdui_navigation_rail(
      {
        value: this.status,
        contained: this.contained,
        onchange: () => {
          this.status = this.navRailRef.current!.node.value! as Value;
          this.$update();
        },
      },
      _ => {
        _.for(
          items,
          ([value]) => value,
          item => {
            const [value, icon] = item;
            _._mdui_navigation_rail_item(
              {
                value,
                icon,
              },
              contentOverride[value] ?? value,
            );
          },
        );

        if (bottomSlot) {
          _._div({ slot: "bottom" }, bottomSlot);
        }
      },
    );
    return this.status as Value;
  }
}
