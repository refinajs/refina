import { Content, D, TriggerComponent, TriggerComponentContext } from "refina";
import FluentUI from "../../plugin";
import dialogSurfaceStyles from "./dialogSurface.styles";

@FluentUI.triggerComponent("fDialogSurface")
export class FDialogSurface extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, inner: D<Content>): void {
    _.portal(() => {
      dialogSurfaceStyles.backdrop(false)(_);
      _._div({
        onclick: this.$fireWith(),
      });

      dialogSurfaceStyles.root(_);
      _._div(
        {
          tabIndex: -1,
          onkeydown: (event) => {
            if (event.key === "Escape" && !event.defaultPrevented) {
              this.$fire();
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
