import { Component, Content, D, MainElRef, ref } from "refina";
import FluentUI from "../../plugin";
import { resolvePositioningShorthand } from "../../positioning";
import "../fPortal";
import { tooltipBorderRadius, visibleTooltipSymbol } from "./constants";
import styles from "./fTooltip.styles";

interface VisibleTooltip {
  component: Component<{}>;
  hide: (by: Component<{}>) => void;
}

declare module "refina" {
  interface Components {
    fTooltip(inner: D<Content>, content: D<Content>): void;
  }
}
FluentUI.outputComponents.fTooltip = function (_) {
  let visible = false;
  const embedRef: MainElRef = ref();
  let timeout = NaN;
  const clearThisTimeout = () => {
    if (!Number.isNaN(timeout)) clearTimeout(timeout);
  };

  return (inner: D<Content>, content: D<Content>) => {
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
      clearThisTimeout();
      timeout = setTimeout(() => {
        visible = true;
        _.$update();
      }, delay);
    };
    const onTriggerLeave = () => {
      clearThisTimeout();
      timeout = setTimeout(() => {
        visible = false;
        _.$update();
      }, 250);
    };

    let triggerElement = embedRef.current?.$mainEl?.node;
    if (triggerElement) {
      triggerElement.onpointerenter = null;
      triggerElement.onpointerleave = null;
      triggerElement.onfocus = null;
      triggerElement.onblur = null;
    }

    _.$ref(embedRef) && _.embed(inner);

    triggerElement = embedRef.current?.$mainEl?.node;
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
        visible = false;
        _.$update();
      });
    } else {
      throw new Error(
        "Cannot find trigger element, did you forget to use the new context in the inner part?",
      );
    }

    if (visible) {
      (
        _.$permanentData[visibleTooltipSymbol] as VisibleTooltip | undefined
      )?.hide(this);
      _.$permanentData[visibleTooltipSymbol] = {
        component: this,
        hide: (by: Component<{}>) => {
          if (by === this) return;
          clearThisTimeout();
          visible = false;
        },
      } satisfies VisibleTooltip;

      if (_.$updateContext) {
        _.$window.addEventListener(
          "keydown",
          ev => {
            if (ev.key === "Escape") {
              if (visible) {
                visible = false;
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
        targetRef: embedRef,
        enabled: visible,
        arrowPadding: 2 * tooltipBorderRadius,
        position: "above" as const,
        align: "center" as const,
        offset: 4,
        ...resolvePositioningShorthand("above"),
      };
      const { containerRef } = _.usePositioning(positioningOptions, visible);

      _.fPortal(_ => {
        styles.content(visible)(_);
        _.$ref(containerRef) &&
          _._div(
            {
              onpointerenter: clearThisTimeout,
              onpointerleave: onTriggerLeave,
            },
            content,
          );
      });
    }
  };
};
