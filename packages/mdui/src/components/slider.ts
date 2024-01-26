import { Model, TriggerComponent, _, elementRef, unwrap } from "refina";

export class MdSlider extends TriggerComponent {
  sliderRef = elementRef<"mdui-slider">();
  $main(
    value: Model<number>,
    disabled = false,
    step = 1,
    min = 0,
    max = 100,
  ): this is {
    $ev: number;
  } {
    _.$ref(this.sliderRef);
    _._mdui_slider({
      value: unwrap(value),
      disabled,
      min,
      max,
      step,
      oninput: () => {
        const newValue = this.sliderRef.current!.node.value;
        this.$updateModel(value, newValue);
        this.$fire(newValue);
      },
    });
    return this.$fired;
  }
}
