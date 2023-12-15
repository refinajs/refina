import {
  Content,
  D,
  HTMLElementComponent,
  MainElRef,
  View,
  d,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import "../fPortal";
import surfaceStyles from "./surface.styles";

declare module "refina" {
  interface Components {
    fControlledPopover(
      targetRef: MainElRef,
      open: D<boolean>,
      inner: D<Content<[close: () => void]>>,
      // withArrow？: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
FluentUI.triggerComponents.fControlledPopover = function (_) {
  const contentRef = ref<HTMLElementComponent<"div">>();
  // const arrowRef = ref<HTMLElementComponent<"div">>();

  return (
    targetRef,
    open,
    inner,
    // withArrow = false,
  ) => {
    const innerValue = getD(inner);
    const close = () => {
      _.$setD(open, false);
      this.$fire();
    };

    if (getD(open)) {
      if (_.$updateContext) {
        _.$root.addEventListener(
          "click",
          ev => {
            const target = ev.composedPath()[0] as HTMLElement;
            const isOutside = [contentRef, targetRef].every(
              ref => !ref.current!.$mainEl!.node.contains(target),
            );

            if (isOutside) {
              close();
            }
          },
          true,
        );
      }

      const {} = _.usePositioning({
        targetRef,
        containerRef: contentRef,
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

      _.fPortal(_ => {
        surfaceStyles.root("medium")(_);
        _.$ref(contentRef) &&
          _._div(
            {
              onkeydown: ev => {
                if (
                  ev.key === "Escape" &&
                  contentRef.current?.node.contains(ev.target as Node)
                ) {
                  ev.preventDefault();
                  close();
                }
              },
            },
            _ => {
              // if (getD(withArrow)) {
              //   surfaceStyles.arrow("medium")(_);
              //   _.$ref(arrowRef) && _._div();
              // }
              _.embed(ctx =>
                typeof innerValue === "function"
                  ? innerValue(ctx, close)
                  : innerValue,
              );
            },
          );
      });
    }
  };
};

declare module "refina" {
  interface Components {
    fPopover(
      trigger: D<
        View<[targetRef: MainElRef, trigger: (open?: D<boolean>) => void]>
      >,
      inner: D<Content<[close: () => void]>>,
      // withArrow: D<boolean> = false,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fPopover = function (_) {
  const opened = d(false);
  const targetRef = ref<HTMLElementComponent>();
  return (trigger, inner) => {
    _.embed(ctx =>
      getD(trigger)(ctx, targetRef, open => {
        opened.value = getD(open) ?? !opened.value;
      }),
    );
    if (_.fControlledPopover(targetRef, opened, inner /*, withArrow*/)) {
      this.$fire(opened.value);
    }
  };
};
