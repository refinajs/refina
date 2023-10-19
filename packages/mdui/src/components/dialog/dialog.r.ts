import { ComponentContext, Content, D, HTMLElementComponent, OutputComponent, ref } from "refina";
import MdUI from "../../plugin";
import mdui from "mdui";
import { UpdateMDUI } from "../../symbol";

type Oper = [open: () => void, close: () => void];
type OperType = [() => void, () => void];

@MdUI.outputComponent("mdDialog")
export class MdDialog extends OutputComponent {
  dialogEl = ref<HTMLElementComponent<"div">>();
  main(
    _: ComponentContext<this>,
    title: D<Content>,
    content: (...args: Oper) => D<Content>,
    actions: (...args: Oper) => D<Content>,
    trigger: (...args: Oper) => void,
  ): void {
    let trig: OperType = [
      () => {
        new mdui.Dialog(this.dialogEl.current!.node).open();
        _.$permanentData[UpdateMDUI] = true;
      },
      () => {
        new mdui.Dialog(this.dialogEl.current!.node).close();
        _.$permanentData[UpdateMDUI] = true;
      },
    ];
    _.$cls`mdui-dialog`;
    _.$ref(this.dialogEl) &&
      _._div({}, (_) => {
        _.$cls`mdui-dialog-title`;
        _._div({}, title);
        _.$cls`mdui-dialog-content`;
        _._div({}, content(...trig));
        _.$cls`mdui-dialog-actions`;
        _._div({}, actions(...trig));
      });
    trigger(...trig);
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDialog: MdDialog;
  }
}
