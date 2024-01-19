import {
  Content,
  HTMLElementComponent,
  MainElRef,
  Model,
  View,
  model,
  ref,
  valueOf,
} from "refina";
import FluentUI from "../../plugin";
import styles from "./styles";

declare module "refina" {
  interface Components {
    fControlledPopover(
      targetRef: MainElRef,
      open: Model<boolean>,
      inner: Content<[close: () => void]>,
      // withArrow？: boolean,
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
    const close = () => {
      _.$updateModel(open, false);
      this.$fire();
    };

    if (valueOf(open)) {
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
        styles.root("medium")(_);
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
              // if (withArrow) {
              //   surfaceStyles.arrow("medium")(_);
              //   _.$ref(arrowRef) && _._div();
              // }
              _.embed(ctx =>
                typeof inner === "function" ? inner(ctx, close) : inner,
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
      trigger: View<[targetRef: MainElRef, trigger: (open?: boolean) => void]>,
      inner: Content<[close: () => void]>,
      // withArrow: boolean = false,
    ): this is {
      $ev: boolean;
    };
  }
}
FluentUI.triggerComponents.fPopover = function (_) {
  const opened = model(false);
  const targetRef = ref<HTMLElementComponent>();
  return (trigger, inner) => {
    _.embed(ctx =>
      trigger(ctx, targetRef, open => {
        opened.value = open ?? !opened.value;
      }),
    );
    if (_.fControlledPopover(targetRef, opened, inner /*, withArrow*/)) {
      this.$fire(opened.value);
    }
  };
};
