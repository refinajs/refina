import {
  Content,
  View,
  HTMLElementComponent,
  PrimaryElRef,
  Model,
  TriggerComponent,
  _,
  model,
  ref,
  unwrap,
} from "refina";
import { usePositioning } from "../../positioning";
import { FPortal } from "../portal";
import useStyles from "./styles";

export class FControlledPopover extends TriggerComponent<void> {
  contentRef = ref<HTMLElementComponent<"div">>();
  // const arrowRef = ref<HTMLElementComponent<"div">>();

  $main(
    targetRef: PrimaryElRef,
    open: Model<boolean>,
    children: Content<[close: () => void]>,
    // withArrow？: boolean,
  ): this is {
    $ev: void;
  } {
    const styles = useStyles("medium");

    const close = () => {
      this.$updateModel(open, false);
      this.$fire();
    };

    if (unwrap(open)) {
      if (_.$updateContext) {
        _.$root.addEventListener(
          "click",
          ev => {
            const target = ev.composedPath()[0] as HTMLElement;
            const isOutside = [this.contentRef, targetRef].every(
              ref => !ref.current!.$primaryEl!.node.contains(target),
            );

            if (isOutside) {
              close();
            }
          },
          true,
        );
      }

      const {} = _(usePositioning)({
        targetRef,
        containerRef: this.contentRef,
        position: "above" as const,
        align: "center" as const,
        // arrowPadding: 2 * popoverSurfaceBorderRadius,
        fallbackPositions: [
          "above",
          "after",
          "after-top",
          "before",
          "before-top",
        ],
      });

      _(FPortal)(_ => {
        styles.root();
        _.$ref(this.contentRef);
        _._div(
          {
            onkeydown: ev => {
              if (
                ev.key === "Escape" &&
                this.contentRef.current?.node.contains(ev.target as Node)
              ) {
                ev.preventDefault();
                close();
              }
            },
          },
          _ => {
            // if (withArrow) {
            //   surfaceStyles.arrow("medium")(_);
            //   _.$ref(arrowRef) && _._div();
            // }
            _.embed(() =>
              typeof children === "function" ? children(close) : children,
            );
          },
        );
      });
    }
    return this.$fired;
  }
}

export class FPopover extends TriggerComponent {
  opened = model(false);
  targetRef = ref<HTMLElementComponent>();
  $main(
    trigger: View<[targetRef: PrimaryElRef, trigger: (open?: boolean) => void]>,
    children: Content<[close: () => void]>, // withArrow: boolean = false,
  ): this is {
    $ev: boolean;
  } {
    _.embed(() =>
      trigger(this.targetRef, open => {
        this.opened.value = open ?? !this.opened.value;
      }),
    );
    if (
      _(FControlledPopover)(
        this.targetRef,
        this.opened,
        children /*, withArrow*/,
      )
    ) {
      this.$fire(this.opened.value);
    }
    return this.$fired;
  }
}
