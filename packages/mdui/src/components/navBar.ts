import { Content, HTMLElementComponent, ref, valueOf } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdNavBar<Value extends string>(
      options: (Value | [value: Value, iconName?: string])[],
      contentOverride?: Partial<Record<Value, Content>>,
    ): Value;
  }
}
MdUI.statusComponents.mdNavBar = function (_) {
  const navBarRef = ref<HTMLElementComponent<"mdui-navigation-bar">>();
  return (options, contentOverride = {}) => {
    const firstOption = valueOf(options)[0];
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
            option => (Array.isArray(option) ? option[0] : option),
            option => {
              const [value, icon] = Array.isArray(option) ? option : [option];
              _._mdui_navigation_bar_item(
                {
                  value,
                  icon,
                },
                contentOverride[value] ?? value,
              );
            },
          ),
      );
  };
};
