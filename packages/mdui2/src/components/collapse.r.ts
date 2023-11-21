import { ComponentContext, Content, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import MdUI2 from "../plugin";

@MdUI2.triggerComponent("mdCollapse")
export class MdCollapse extends TriggerComponent<boolean> {
  collapseRef = ref<HTMLElementComponent<"mdui-collapse">>();
  main(_: ComponentContext, checked: D<boolean>, label?: D<Content>, disabled: D<boolean> = false): void {
    _.$ref(this.collapseRef) &&
      _._mdui_collapse(
        {
          checked: getD(checked),
          disabled: getD(disabled),
          onchange: () => {
            const newState = this.collapseRef.current!.node.checked;
            _.$setD(checked, newState);
            this.$fire(newState);
          },
        },
        label,
      );
  }
}

declare module "refina" {
  interface TriggerComponents {
    mdCollapse: MdCollapse;
  }
}
