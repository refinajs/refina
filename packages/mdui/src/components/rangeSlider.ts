import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdRangeSlider(
      lowValue: Model<number>,
      highValue: Model<number>,
      disabled?: boolean,
      step?: number,
      min?: number,
      max?: number,
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
        disabled,
        min,
        max,
        step,
        oninput: () => {
          const [newLow, newHigh] = sliderRef.current!.node.value;
          _.$updateModel(lowValue, newLow);
          _.$updateModel(highValue, newHigh);
          this.$fire([newLow, newHigh]);
        },
      });

    // TODO: remove this hack
    setTimeout(() => {
      sliderRef.current!.node.value = [valueOf(lowValue), valueOf(highValue)];
    });
  };
};
