import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, getDArray, ref } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdRangeSlider")
export class MdRangeSlider extends TriggerComponent<[low: number, high: number]> {
  sliderRef = ref<HTMLElementComponent<"mdui-range-slider">>();
  main(
    _: ComponentContext,
    value: D<[low: D<number>, high: D<number>]>,
    disabled: D<boolean> = false,
    step: D<number> = 1,
    min: D<number> = 0,
    max: D<number> = 100,
  ): void {
    _.$ref(this.sliderRef) &&
      _._mdui_range_slider({
        disabled: getD(disabled),
        min: getD(min),
        max: getD(max),
        step: getD(step),
        oninput: () => {
          const newValue = this.sliderRef.current!.node.value as [number, number];
          const valueValue = getD(value);
          if (!_.$setD(valueValue[0], newValue[0]) && !_.$setD(valueValue[1], newValue[1])) {
            valueValue[0] = newValue[0];
            valueValue[1] = newValue[1];
          }
          this.$fire(newValue);
        },
      });

    // TODO: remove this hack
    setTimeout(() => {
      this.sliderRef.current!.node.value = getDArray(value);
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdRangeSlider: MdRangeSlider;
  }
}
