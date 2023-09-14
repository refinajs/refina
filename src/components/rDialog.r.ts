import { Content, D, TriggerComponent, TriggerComponentContext, getD, triggerComponent } from "../lib";

@triggerComponent("rDialog")
export class RDialog extends TriggerComponent<number> {
  main(
    _: TriggerComponentContext<number, this>,
    open: D<boolean>,
    heading: D<Content>,
    body: D<Content>,
    closeButton: D<string | boolean> = false,
    buttons: D<D<Content>[]> = [],
    disabled: D<D<boolean>[]> = [],
  ) {
    const closeButtonRaw = getD(closeButton);
    const hasCloseButton = closeButtonRaw !== false;
    const closeButtonText = closeButtonRaw === true ? "Close" : (closeButtonRaw as string);
    _.rPopup(open, () => {
      if (hasCloseButton) {
        if (_.rCard(heading, body, [closeButtonText, ...getD(buttons)], [false, ...getD(disabled)])) {
          if (_.$ev === 0) {
            _.$setD(open, false);
          } else {
            _.$fire(_.$ev - 1);
          }
        }
      } else {
        if (_.rCard(heading, body, buttons, disabled)) {
          _.$fire(_.$ev);
        }
      }
    });
  }
}

declare module "../component/index" {
  interface TriggerComponents {
    rDialog: RDialog;
  }
}
