import { Component, Content, PrimaryElRef, _, ref } from "refina";
import { resolvePositioningShorthand, usePositioning } from "../../positioning";
import { FPortal } from "../portal";
import { tooltipBorderRadius, visibleTooltipSymbol } from "./constants";
import useStyles from "./styles";

interface VisibleTooltip {
  component: Component;
  hide: (by: Component) => void;
}

export class FTooltip extends Component {
  visible = false;
  embedRef: PrimaryElRef = ref();
  timeout = NaN;
  clearThisTimeout = () => {
    if (!Number.isNaN(this.timeout)) clearTimeout(this.timeout);
  };

  $main(inner: Content, content: Content): void {
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
      this.clearThisTimeout();
      this.timeout = setTimeout(() => {
        this.visible = true;
        this.$update();
      }, delay);
    };
    const onTriggerLeave = () => {
      this.clearThisTimeout();
      this.timeout = setTimeout(() => {
        this.visible = false;
        this.$update();
      }, 250);
    };

    let triggerElement = this.embedRef.current?.$primaryEl?.node;
    if (triggerElement) {
      triggerElement.onpointerenter = null;
      triggerElement.onpointerleave = null;
      triggerElement.onfocus = null;
      triggerElement.onblur = null;
    }

    _.$ref(this.embedRef) && _.embed(inner);

    triggerElement = this.embedRef.current?.$primaryEl?.node;
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
        this.$update();
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
        hide: (by: Component) => {
          if (by === this) return;
          this.clearThisTimeout();
          this.visible = false;
        },
      } satisfies VisibleTooltip;

      if (_.$updateContext) {
        _.$window.addEventListener(
          "keydown",
          ev => {
            if (ev.key === "Escape") {
              if (this.visible) {
                this.visible = false;
                this.$update();
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
      const { containerRef } = _(usePositioning)(
        positioningOptions,
        this.visible,
      );

      const styles = useStyles(this.visible);

      _(FPortal)(_ => {
        styles.content();
        _.$ref(containerRef) &&
          _._div(
            {
              onpointerenter: this.clearThisTimeout,
              onpointerleave: onTriggerLeave,
            },
            content,
          );
      });
    }
  }
}
