import { Content, TriggerComponent, _ } from "refina";
import useSurfaceStyles from "./styles";
import { FPortal } from "../../portal";

export class FDialogSurface extends TriggerComponent<void> {
  $main(inner: Content): this is {
    $ev: void;
  } {
    const surfaceStyles = useSurfaceStyles(false);

    _(FPortal)(_ => {
      surfaceStyles.backdrop();
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

      surfaceStyles.root();
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
    return this.$fired;
  }
}
