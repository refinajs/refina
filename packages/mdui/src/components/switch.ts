import { Model, TriggerComponent, _, elementRef, valueOf } from "refina";

export class MdSwitch extends TriggerComponent {
  switchRef = elementRef<"mdui-switch">();
  $main(
    checked: Model<boolean>,
    disabled = false,
  ): this is {
    $ev: boolean;
  } {
    _.$ref(this.switchRef);
    _._mdui_switch({
      checked: valueOf(checked),
      disabled,
      onchange: () => {
        const newState = this.switchRef.current!.node.checked;
        this.$updateModel(checked, newState);
        this.$fire(newState);
      },
    });
    return this.$fired;
  }
}
