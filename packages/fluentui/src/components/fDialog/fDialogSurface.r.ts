import { ComponentContext, Content, D, TriggerComponent } from "refina";
import FluentUI from "../../plugin";
import "../fPortal";
import dialogSurfaceStyles from "./dialogSurface.styles";

@FluentUI.triggerComponent("fDialogSurface")
export class FDialogSurface extends TriggerComponent<void> {
  main(_: ComponentContext<this>, inner: D<Content>): void {
    _.fPortal(_ => {
      dialogSurfaceStyles.backdrop(false)(_);
      _._div({
        onmousedown: ev => {
          ev.stopPropagation();
        },
        onmouseup: ev => {
          ev.stopPropagation();
        },
        onclick: ev => {
          ev.stopPropagation();
          this.$fire();
        },
      });

      dialogSurfaceStyles.root(_);
      _._div(
        {
          tabIndex: -1,
          onkeydown: event => {
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
