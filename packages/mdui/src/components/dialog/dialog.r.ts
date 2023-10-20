import mdui from "mdui";
import { Dialog } from "mdui/es/components/dialog/class";
import { ComponentContext, Content, Context, D, HTMLElementComponent, OutputComponent, getD } from "refina";
import MdUI from "../../plugin";
import { UpdateDialogSize } from "../../symbol";

@MdUI.outputComponent("mdDialog")
export class MdDialog extends OutputComponent {
  dialogRef = {
    dialog: null as Dialog | null,
    _current: null as HTMLElementComponent<"div"> | null,
    get current() {
      return this._current;
    },
    set current(v) {
      if (this._current !== v) {
        if (v === null) {
          this.dialog = null;
        } else {
          this.dialog = new mdui.Dialog(v!.node);
        }
      }
      this._current = v;
    },
  };
  main(
    _: ComponentContext<this>,
    trigger: Content<[setOpen: (open?: D<boolean>) => void]>,
    title: D<Content<[setClose: (open?: D<boolean>) => void]>>,
    body: D<Content<[setClose: (open?: D<boolean>) => void]>>,
    actions: D<Content<[setClose: (open?: D<boolean>) => void]>>,
  ): void {
    const toContent = (defaultOpen: boolean, inner: D<Content<[setClose: (open?: D<boolean>) => void]>>) => {
      const innerValue = getD(inner);
      if (typeof innerValue === "function") {
        return (context: Context) => {
          innerValue(context, (open: D<boolean> = defaultOpen) => {
            if (getD(open)) {
              this.dialogRef.dialog?.open();
            } else {
              this.dialogRef.dialog?.close();
            }
          });
        };
      } else {
        return innerValue;
      }
    };

    _.embed(toContent(true, trigger));
    _.$cls`mdui-dialog`;
    _.$ref(this.dialogRef) &&
      _._div({}, (_) => {
        _.$cls`mdui-dialog-title`;
        _._div({}, toContent(false, title));
        _.$cls`mdui-dialog-content`;
        _._div({}, toContent(false, body));
        _.$cls`mdui-dialog-actions`;
        _._div({}, toContent(false, actions));
      });
    _.$permanentData[UpdateDialogSize] = this.dialogRef.dialog;
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDialog: MdDialog;
  }
}
