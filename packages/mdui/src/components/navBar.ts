import {
  Content,
  DArray,
  DPartialRecord,
  HTMLElementComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdNavBar<Value extends string>(
      options: DArray<Value | [value: Value, iconName?: string]>,
      contentOverride?: DPartialRecord<Value, Content>,
    ): Value;
  }
}
MdUI.statusComponents.mdNavBar = function (_) {
  const navBarRef = ref<HTMLElementComponent<"mdui-navigation-bar">>();
  return (options, contentOverride = {}) => {
    const contentOverrideValue = getD(contentOverride);

    const firstOption = getD(getD(options)[0]);
    this.$_status ??= Array.isArray(firstOption) ? firstOption[0] : firstOption;

    _.$ref(navBarRef) &&
      _._mdui_navigation_bar(
        {
          value: this.$status,
          onchange: () => {
            this.$status = navBarRef.current!.node.value!;
          },
        },
        _ =>
          _.for(
            options,
            item => getD(item)[0],
            option => {
              const optionValue = getD(option);
              const [value, icon] = Array.isArray(optionValue)
                ? optionValue
                : [optionValue];
              _._mdui_navigation_bar_item(
                {
                  value,
                  icon,
                },
                contentOverrideValue[value] ?? value,
              );
            },
          ),
      );
  };
};
