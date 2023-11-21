import {
  ComponentContext,
  Content,
  D,
  HTMLElementComponent,
  TriggerComponent,
  bindArgsToContent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdDialog")
export class MdDialog extends TriggerComponent<boolean> {
  dialogRef = ref<HTMLElementComponent<"mdui-dialog">>();
  main(
    _: ComponentContext,
    trigger: Content<[open: (open?: D<boolean>) => void]>,
    title: D<Content<[close: (open?: D<boolean>) => void]>>,
    body: D<Content<[close: (open?: D<boolean>) => void]>>,
    actions: D<Content<[close: (open?: D<boolean>) => void]>>,
    presistent: D<boolean> = false,
  ): void {
    const presistentValue = getD(presistent);

    const open = (open: D<boolean> = true) => {
      const openValue = getD(open);
      this.dialogRef.current!.node.open = openValue;
      this.$fire(openValue);
    };
    const close = (open: D<boolean> = false) => {
      const openValue = getD(open);
      this.dialogRef.current!.node.open = openValue;
      this.$fire(openValue);
    };

    _.embed(bindArgsToContent(trigger, open));
    _.$ref(this.dialogRef) &&
      _._mdui_dialog(
        {
          closeOnOverlayClick: !presistentValue,
          closeOnEsc: !presistentValue,
        },
        _ => {
          _._div(
            {
              slot: "headline",
            },
            bindArgsToContent(title, close),
          );
          _._div(
            {
              slot: "description",
            },
            bindArgsToContent(body, close),
          );
          _._div(
            {
              slot: "action",
            },
            bindArgsToContent(actions, close),
          );
        },
      );
  }
}

declare module "refina" {
  interface OutputComponents {
    mdDialog: MdDialog;
  }
}
