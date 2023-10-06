import { Content, D, TriggerComponent, TriggerComponentContext, triggerComponent } from "refina";
import dialogSurfaceStyles from "./dialogSurface.styles";

@triggerComponent("fDialogSurface")
export class FDialogSurface extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>): void {
    _.portal(() => {
      dialogSurfaceStyles.backdrop(false)(_);
      _._div({
        onclick: _.$fireWith(),
      });

      dialogSurfaceStyles.root(_);
      _._div(
        {
          tabIndex: -1,
          onkeydown: (event) => {
            if (event.key === "Escape" && !event.defaultPrevented) {
              _.$fire();
              // stop propagation to avoid conflicting with other elements that listen for `Escape`
              // e,g: nested Dialog, Popover, Menu and Tooltip
              event.stopPropagation();
            }
          },
        },
        inner,
      );
    });
  }
}

declare module "refina" {
  interface TriggerComponents {
    fDialogSurface: FDialogSurface;
  }
}
