import {
  ComponentContext,
  Content,
  DArray,
  DPartialRecord,
  HTMLElementComponent,
  StatusComponent,
  bySelf,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.statusComponent("mdNavBar")
export class MdNavBar<Value extends string> extends StatusComponent<Value> {
  navBarRef = ref<HTMLElementComponent<"mdui-navigation-bar">>();
  main(
    _: ComponentContext,
    options: DArray<Value | [value: Value, iconName?: string]>,
    contentOverride: DPartialRecord<Value, Content> = {},
  ): void {
    const contentOverrideValue = getD(contentOverride);

    const firstOption = getD(getD(options)[0]);
    this.$_status ??= Array.isArray(firstOption) ? firstOption[0] : firstOption;

    _.$ref(this.navBarRef) &&
      _._mdui_navigation_bar(
        {
          value: this.$status,
          onchange: () => {
            this.$status = this.navBarRef.current!.node.value as Value;
          },
        },
        _ =>
          _.for(options, bySelf, option => {
            const optionValue = getD(option);
            const [value, icon] = Array.isArray(optionValue) ? optionValue : [optionValue];
            _._mdui_navigation_bar_item(
              {
                value,
                icon,
              },
              contentOverrideValue[value] ?? value,
            );
          }),
      );
  }
}

declare module "refina" {
  interface ContextFuncs<C> {
    mdNavBar: MdNavBar<any> extends C["enabled"]
      ? <Value extends string>(
          options: DArray<Value | [value: Value, iconName?: string]>,
          contentOverride?: DPartialRecord<Value, Content>,
        ) => Value
      : never;
  }
}
