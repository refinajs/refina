import {
  ComponentContext,
  Content,
  D,
  HTMLElementComponent,
  MainElRef,
  TriggerComponent,
  View,
  d,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import "../fPortal";
import surfaceStyles from "./surface.styles";

@FluentUI.triggerComponent("fModalPopover")
export class FModalPopover extends TriggerComponent<void> {
  arrowRef = ref<HTMLElementComponent<"div">>();
  contentRef = ref<HTMLElementComponent<"div">>();
  main(
    _: ComponentContext<this>,
    targetRef: MainElRef,
    open: D<boolean>,
    inner: D<Content<[close: () => void]>>,
    // withArrow: D<boolean> = false,
  ): void {
    const innerValue = getD(inner);
    const close = () => {
      _.$setD(open, false);
      this.$fire();
    };

    if (getD(open)) {
      _.$app.registerRootEventListener(
        "click",
        ev => {
          const target = ev.composedPath()[0] as HTMLElement;
          const isOutside = [this.contentRef, targetRef].every(ref => !ref.current!.$mainEl!.contains(target));

          if (isOutside) {
            close();
          }
        },
        true,
      );

      const {} = _.usePositioning({
        targetRef,
        containerRef: this.contentRef,
        position: "above" as const,
        align: "center" as const,
        // arrowPadding: 2 * popoverSurfaceBorderRadius,
        fallbackPositions: ["above", "after", "after-top", "before", "before-top"],
      });

      _.fPortal(() => {
        surfaceStyles.root("medium")(_);
        _.$ref(this.contentRef) &&
          _._div(
            {
              onkeydown: ev => {
                if (ev.key === "Escape" && this.contentRef.current?.node.contains(ev.target as Node)) {
                  ev.preventDefault();
                  close();
                }
              },
            },
            _ => {
              // if (getD(withArrow)) {
              //   surfaceStyles.arrow("medium")(_);
              //   _.$ref(this.arrowRef) && _._div();
              // }
              _.embed(ctx => (typeof innerValue === "function" ? innerValue(ctx, close) : innerValue));
            },
          );
      });
    }
  }
}

@FluentUI.triggerComponent("fPopover")
export class FPopover extends TriggerComponent<boolean> {
  open = d(false);
  targetRef = ref<HTMLElementComponent>();
  main(
    _: ComponentContext<this>,
    trigger: D<View<[targetRef: MainElRef, trigger: (open?: D<boolean>) => void]>>,
    inner: D<Content<[close: () => void]>>,
    // withArrow: D<boolean> = false,
  ): void {
    _.embed(ctx =>
      getD(trigger)(ctx, this.targetRef, open => {
        this.open.value = getD(open) ?? !this.open.value;
      }),
    );
    if (_.fModalPopover(this.targetRef, this.open, inner /*, withArrow*/)) {
      this.$fire(this.open.value);
    }
  }
}

declare module "refina" {
  interface TriggerComponents {
    fModalPopover: FModalPopover;
    fPopover: FPopover;
  }
}
