import { ComponentContext, Content, D, HTMLElementComponent, OutputComponent, ref } from "refina";
import MdUI from "../../plugin";
import mdui from "mdui";

@MdUI.outputComponent("mdDialog")
export class MdDialog extends OutputComponent {
  dialogEl = ref<HTMLElementComponent<"div">>();
  main(
    _: ComponentContext<this>,
    title: D<Content>,
    content: D<Content>,
    actions: D<Content>,
    trigger: (trig: () => void) => void,
  ): void {
    _.$cls`mdui-dialog`;
    _.$ref(this.dialogEl) &&
      _._div({}, (_) => {
        _.$cls`mdui-dialog-title`;
        _._div({}, title);
        _.$cls`mdui-dialog-content`;
        _._div({}, content);
        _.$cls`mdui-dialog-actions`;
        _._div({}, actions);
      });
    trigger(() => {
      new mdui.Dialog(this.dialogEl.current!.node).open();
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDialog: MdDialog;
  }
}
