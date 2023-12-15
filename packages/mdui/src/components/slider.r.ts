import { D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    mdSlider(
      value: D<number>,
      disabled?: D<boolean>,
      step?: D<number>,
      min?: D<number>,
      max?: D<number>,
    ): this is {
      $ev: number;
    };
  }
}
MdUI.triggerComponents.mdSlider = function (_) {
  const sliderRef = ref<HTMLElementComponent<"mdui-slider">>();
  return (value, disabled = false, step = 1, min = 0, max = 100) => {
    _.$ref(sliderRef) &&
      _._mdui_slider({
        value: getD(value),
        disabled: getD(disabled),
        min: getD(min),
        max: getD(max),
        step: getD(step),
        oninput: () => {
          const newValue = sliderRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};
