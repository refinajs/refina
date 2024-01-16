import { Content } from "refina";
import FluentUI from "../../plugin";
import "../fPortal";
import dialogSurfaceStyles from "./dialogSurface.styles";

declare module "refina" {
  interface Components {
    fDialogSurface(inner: Content): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fDialogSurface = function (_) {
  return (inner: Content) => {
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
  };
};
