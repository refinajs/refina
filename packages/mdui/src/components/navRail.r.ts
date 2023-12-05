import {
  Content,
  Context,
  D,
  DPartialRecord,
  DReadonlyArray,
  HTMLElementComponent,
  StatusComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

@MdUI.statusComponent("mdNavRail")
export class MdNavRail<Value extends string> extends StatusComponent<
  Value,
  {
    contained: boolean;
  }
> {
  navRailRef = ref<HTMLElementComponent<"mdui-navigation-rail">>();
  main(
    _: Context,
    items: DReadonlyArray<[value: Value, iconName?: string]>,
    contentOverride: DPartialRecord<Value, Content> = {},
    bottomSlot?: D<Content>,
  ): void {
    const contentOverrideValue = getD(contentOverride);

    const firstItem = getD(getD(items)[0]);
    this.$_status ??= Array.isArray(firstItem) ? firstItem[0] : firstItem;

    _.$ref(this.navRailRef) &&
      _._mdui_navigation_rail(
        {
          value: this.$status,
          contained: this.$props.contained,
          onchange: () => {
            this.$status = this.navRailRef.current!.node.value as Value;
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
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    mdNavRail: MdNavRail<any> extends C["enabled"]
      ? <Value extends string>(
          items: DReadonlyArray<[value: Value, iconName?: string]>,
          contentOverride?: DPartialRecord<Value, Content>,
          bottomSlot?: D<Content>,
        ) => Value
      : never;
  }
}