import { Content, Context, D, Embed, OutputComponent, ref } from "refina";
import FluentUI from "../../plugin";
import { resolvePositioningShorthand } from "../../positioning";
import "../fPortal";
import { tooltipBorderRadius, visibleTooltipSymbol } from "./constants";
import styles from "./fTooltip.styles";

interface VisibleTooltip {
  component: FTooltip;
  hide: (by: FTooltip) => void;
}

@FluentUI.outputComponent("fTooltip")
export class FTooltip extends OutputComponent {
  visible = false;
  embedRef = ref<Embed>();
  timeout = NaN;
  clearTimeout = () => {
    if (!Number.isNaN(this.timeout)) clearTimeout(this.timeout);
  };

  main(_: Context, inner: D<Content>, content: D<Content>): void {
    const onTriggerEnter = () => {
      const visibleTooltip = _.$permanentData[visibleTooltipSymbol] as
        | VisibleTooltip
        | undefined;
      const anotherTooltip =
        visibleTooltip && visibleTooltip.component !== this;
      const delay = anotherTooltip ? 0 : 250;
      if (anotherTooltip) {
        visibleTooltip.hide(this);
      }
      this.clearTimeout();
      this.timeout = setTimeout(() => {
        this.visible = true;
        _.$update();
      }, delay);
    };
    const onTriggerLeave = () => {
      this.clearTimeout();
      this.timeout = setTimeout(() => {
        this.visible = false;
        _.$update();
      }, 250);
    };

    let triggerElement = this.embedRef.current?.$mainEl?.node;
    if (triggerElement) {
      triggerElement.onpointerenter = null;
      triggerElement.onpointerleave = null;
      triggerElement.onfocus = null;
      triggerElement.onblur = null;
    }

    _.$ref(this.embedRef) && _.embed(inner);

    triggerElement = this.embedRef.current?.$mainEl?.node;
    if (triggerElement) {
      const mergeCallbacks =
        <E>(cb1: ((ev: E) => void) | null, cb2: (ev: E) => void) =>
        (ev: E) => {
          cb1?.(ev);
          cb2(ev);
        };
      triggerElement.onpointerenter = mergeCallbacks(
        triggerElement.onpointerenter,
        onTriggerEnter,
      );
      triggerElement.onpointerleave = mergeCallbacks(
        triggerElement.onpointerleave,
        onTriggerLeave,
      );
      triggerElement.onfocus = mergeCallbacks(
        triggerElement.onfocus,
        onTriggerEnter,
      );
      triggerElement.onblur = mergeCallbacks(triggerElement.onblur, () => {
        this.visible = false;
        _.$update();
      });
    } else {
      throw new Error(
        "Cannot find trigger element, did you forget to use the new context in the inner part?",
      );
    }

    if (this.visible) {
      (
        _.$permanentData[visibleTooltipSymbol] as VisibleTooltip | undefined
      )?.hide(this);
      _.$permanentData[visibleTooltipSymbol] = {
        component: this,
        hide: (by: FTooltip) => {
          if (by === this) return;
          this.clearTimeout();
          this.visible = false;
        },
      } satisfies VisibleTooltip;

      if (_.$updateState) {
        _.$window.addEventListener(
          "keydown",
          ev => {
            if (ev.key === "Escape") {
              if (this.visible) {
                this.visible = false;
                _.$update();
              }
            }
          },
          {
            capture: true,
          },
        );
      }

      const positioningOptions = {
        targetRef: this.embedRef,
        enabled: this.visible,
        arrowPadding: 2 * tooltipBorderRadius,
        position: "above" as const,
        align: "center" as const,
        offset: 4,
        ...resolvePositioningShorthand("above"),
      };
      const { containerRef } = _.usePositioning(
        positioningOptions,
        this.visible,
      );

      _.fPortal(_ => {
        styles.content(this.visible)(_);
        _.$ref(containerRef) &&
          _._div(
            {
              onpointerenter: this.clearTimeout,
              onpointerleave: onTriggerLeave,
            },
            content,
          );
      });
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    fTooltip: FTooltip;
  }
}
