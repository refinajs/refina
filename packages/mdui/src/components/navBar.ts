import { Component, Content, _, elementRef, unwrap } from "refina";

export class MdNavBar extends Component {
  navBarRef = elementRef<"mdui-navigation-bar">();
  status: string;
  $main<Value extends string>(
    options: (Value | [value: Value, iconName?: string])[],
    contentOverride: Partial<Record<Value, Content>> = {},
  ): Value {
    const firstOption = unwrap(options)[0];
    this.status ??= Array.isArray(firstOption) ? firstOption[0] : firstOption;

    _.$ref(this.navBarRef);
    _._mdui_navigation_bar(
      {
        value: this.status,
        onchange: () => {
          this.status = this.navBarRef.current!.node.value! as Value;
          this.$update();
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
    return this.status as Value;
  }
}
