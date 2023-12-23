import { D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdRangeSlider(
      lowValue: D<number>,
      highValue: D<number>,
      disabled?: D<boolean>,
      step?: D<number>,
      min?: D<number>,
      max?: D<number>,
    ): this is {
      $ev: [low: number, high: number];
    };
  }
}
MdUI.triggerComponents.mdRangeSlider = function (_) {
  const sliderRef = ref<HTMLElementComponent<"mdui-range-slider">>();
  return (
    lowValue,
    highValue,
    disabled = false,
    step = 1,
    min = 0,
    max = 100,
  ) => {
    _.$ref(sliderRef) &&
      _._mdui_range_slider({
        disabled: getD(disabled),
        min: getD(min),
        max: getD(max),
        step: getD(step),
        oninput: () => {
          const [newLow, newHigh] = sliderRef.current!.node.value;
          _.$setD(lowValue, newLow);
          _.$setD(highValue, newHigh);
          this.$fire([newLow, newHigh]);
        },
      });

    // TODO: remove this hack
    setTimeout(() => {
      sliderRef.current!.node.value = [getD(lowValue), getD(highValue)];
    });
  };
};
