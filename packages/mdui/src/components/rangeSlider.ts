import { Model, TriggerComponent, _, elementRef, valueOf } from "refina";

export class MdRangeSlider extends TriggerComponent {
  sliderRef = elementRef<"mdui-range-slider">();
  $main(
    lowValue: Model<number>,
    highValue: Model<number>,
    disabled = false,
    step = 1,
    min = 0,
    max = 100,
  ): this is {
    $ev: [low: number, high: number];
  } {
    _.$ref(this.sliderRef);
    _._mdui_range_slider({
      disabled,
      min,
      max,
      step,
      oninput: () => {
        const [newLow, newHigh] = this.sliderRef.current!.node.value;
        this.$updateModel(lowValue, newLow);
        this.$updateModel(highValue, newHigh);
        this.$fire([newLow, newHigh]);
      },
    });

    // TODO: remove this hack
    setTimeout(() => {
      this.sliderRef.current!.node.value = [
        valueOf(lowValue),
        valueOf(highValue),
      ];
    });
    return this.$fired;
  }
}
