import {
  Context,
  D,
  HTMLElementComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

@MdUI.triggerComponent("mdSlider")
export class MdSlider extends TriggerComponent<number> {
  sliderRef = ref<HTMLElementComponent<"mdui-slider">>();
  main(
    _: Context,
    value: D<number>,
    disabled: D<boolean> = false,
    step: D<number> = 1,
    min: D<number> = 0,
    max: D<number> = 100,
  ): void {
    _.$ref(this.sliderRef) &&
      _._mdui_slider({
        value: getD(value),
        disabled: getD(disabled),
        min: getD(min),
        max: getD(max),
        step: getD(step),
        oninput: () => {
          const newValue = this.sliderRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdSlider: MdSlider;
  }
}
