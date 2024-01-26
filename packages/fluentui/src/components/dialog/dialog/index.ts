import {
  Content,
  Fragment,
  Model,
  TriggerComponent,
  _,
  model,
  unwrap,
} from "refina";
import { FDialogBody } from "../dialogBody";
import { FDialogSurface } from "../dialogSurface";

export class FControlledDialog extends TriggerComponent<void> {
  $main(
    open: Model<boolean>,
    title: Content,
    content: Content<[close: () => void]>,
    actions?: Content<[close: () => void]>,
    actionsPosition: "start" | "end" = "end",
    persist = false,
    closeButton = true,
  ): this is {
    $ev: void;
  } {
    if (unwrap(open)) {
      if (
        _(FDialogSurface)(_ => {
          if (
            _(FDialogBody)(
              title,
              content,
              actions,
              actionsPosition,
              closeButton,
            )
          ) {
            this.$updateModel(open, false);
            this.$fire();
          }
        })
      ) {
        if (!persist) {
          this.$updateModel(open, false);
          this.$fire();
        }
      }
    }
    return this.$fired;
  }
}

export class FDialog extends TriggerComponent {
  opened = model(false);
  $main(
    trigger: Fragment<[open: (open?: boolean) => void]>,
    title: Content,
    content: Content<[close: () => void]>,
    actions?: Content<[close: () => void]>,
    actionsPosition: "start" | "end" = "end",
    persist = false,
  ): this is {
    $ev: boolean;
  } {
    _.embed(() =>
      trigger((open = true) => {
        this.opened.value = open;
        this.$fire(open);
      }),
    );
    this.$primary();
    if (
      _(FControlledDialog)(
        this.opened,
        title,
        content,
        actions,
        actionsPosition,
        persist,
      )
    ) {
      this.$fire(false);
    }
    return this.$fired;
  }
}
