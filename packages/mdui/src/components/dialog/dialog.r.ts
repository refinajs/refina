import { ComponentContext, Content, D, HTMLElementComponent, OutputComponent, ref } from "refina";
import MdUI from "../../plugin";
import mdui from "mdui";
import { UpdateMDUI } from "../../symbol";
import { Dialog } from "mdui/es/components/dialog/class";

// type Oper = [open: () => void, close: () => void];
type OperType = {
  open: () => void;
  close: () => void;
};

@MdUI.outputComponent("mdDialog")
export class MdDialog extends OutputComponent {
  dialogEl = ref<HTMLElementComponent<"div">>();
  dialogObj: Dialog | undefined;
  main(
    _: ComponentContext<this>,
    title: D<Content>,
    content: (close: () => void) => D<Content>,
    actions: (close: () => void) => D<Content>,
    trigger: (open: () => void) => void,
  ): void {
    if (this.dialogObj === undefined && this.dialogEl.current !== null) {
      this.dialogObj = new mdui.Dialog(this.dialogEl.current!.node);
    }
    let trig: OperType = {
      open: () => {
        this.dialogObj!.open();
        _.$permanentData[UpdateMDUI] = true;
      },
      close: () => {
        this.dialogObj!.close();
        _.$permanentData[UpdateMDUI] = true;
      },
    };
    _.$cls`mdui-dialog`;
    _.$ref(this.dialogEl) &&
      _._div({}, (_) => {
        _.$cls`mdui-dialog-title`;
        _._div({}, title);
        _.$cls`mdui-dialog-content`;
        _._div({}, content(trig.close));
        _.$cls`mdui-dialog-actions`;
        _._div({}, actions(trig.close));
      });
    trigger(trig.open);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDialog: MdDialog;
  }
}
