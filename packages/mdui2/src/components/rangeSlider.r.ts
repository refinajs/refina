import {
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdRangeSlider")
export class MdRangeSlider extends TriggerComponent<
  [low: number, high: number]
> {
  sliderRef = ref<HTMLElementComponent<"mdui-range-slider">>();
  main(
    _: Context,
    lowValue: D<number>,
    highValue: D<number>,
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
          const [newLow, newHigh] = this.sliderRef.current!.node.value;
          _.$setD(lowValue, newLow);
          _.$setD(highValue, newHigh);
          this.$fire([newLow, newHigh]);
        },
      });

    // TODO: remove this hack
    setTimeout(() => {
      this.sliderRef.current!.node.value = [getD(lowValue), getD(highValue)];
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdRangeSlider: MdRangeSlider;
  }
}
