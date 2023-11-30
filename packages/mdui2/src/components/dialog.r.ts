import {
  Content,
  Context,
  D,
  TriggerComponent,
  bindArgsToContent,
  getD,
} from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdControlledDialog")
export class MdControlledDialog extends TriggerComponent<boolean> {
  main(
    _: Context,
    open: D<boolean>,
    title: D<Content>,
    body: D<Content>,
    actions: D<Content>,
    presistent: D<boolean> = false,
  ): void {
    const presistentProps = getD(presistent)
      ? {}
      : { closeOnOverlayClick: true, closeOnEsc: true };
    _._mdui_dialog(
      {
        ...presistentProps,
        open: getD(open),
      },
      _ => {
        _._div(
          {
            slot: "headline",
          },
          title,
        );
        _._div(
          {
            slot: "description",
          },
          body,
        );
        _._div(
          {
            slot: "action",
          },
          actions,
        );
      },
    );
  }
}

@MdUI.outputComponent("mdDialog")
export class MdDialog extends TriggerComponent<boolean> {
  open = false;
  main(
    _: Context,
    trigger: D<Content<[open: (open?: D<boolean>) => void]>>,
    title: D<Content<[close: (open?: D<boolean>) => void]>>,
    body: D<Content<[close: (open?: D<boolean>) => void]>>,
    actions: D<Content<[close: (open?: D<boolean>) => void]>>,
    presistent: D<boolean> = false,
  ): void {
    const open = (open: D<boolean> = true) => {
      const openValue = getD(open);
      this.open = openValue;
      this.$fire(openValue);
    };
    const close = (open: D<boolean> = false) => {
      const openValue = getD(open);
      this.open = openValue;
      this.$fire(openValue);
    };

    _.embed(bindArgsToContent(trigger, open));
    _.mdControlledDialog(
      this.open,
      bindArgsToContent(title, close),
      bindArgsToContent(body, close),
      bindArgsToContent(actions, close),
      presistent,
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    mdControlledDialog: MdControlledDialog;
    mdDialog: MdDialog;
  }
}
