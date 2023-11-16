import { computePosition } from "@floating-ui/dom";
import { AppState, ref } from "refina";
import FluentUI from "../plugin";
import { flip as flipMiddleware, offset as offsetMidware } from "./middleware";
import type { PositioningOptions, UsePositioninggResult } from "./types";
import { toFloatingUIPlacement } from "./utils/toFloatingUIPlacement";

FluentUI.registerFunc(
  "usePositioning",
  function (
    _ckey: string,
    options: PositioningOptions = {},
    enabled: boolean = true,
  ): UsePositioninggResult {
    const targetRef = options.targetRef ?? ref(),
      containerRef = options.containerRef ?? ref();

    if (!enabled) return { targetRef, containerRef, updatePosition: () => {} };

    const { align, position, offset, fallbackPositions } = options;

    const updatePosition = () => {
      if (!targetRef.current?.$mainEl || !containerRef.current?.$mainEl) {
        throw new Error(
          "targetRef or containerRef of useFloating is not set or has no $mainEl",
        );
      }
      const targetNode = targetRef.current.$mainEl,
        containerNode = containerRef.current.$mainEl;

      const placement = toFloatingUIPlacement(align, position, false);

      computePosition(targetNode, containerNode, {
        middleware: [
          offset !== undefined && offsetMidware(offset),
          flipMiddleware({
            container: containerNode,
            fallbackPositions,
          }),
        ],
        placement,
      }).then(({ x, y, strategy }) => {
        containerNode.style.left = `${x}px`;
        containerNode.style.top = `${y}px`;
        containerNode.style.position = strategy;
      });
    };

    if (options.immediate !== false) {
      this.$app.pushHook("afterModifyDOM", () => {
        if (this.$app.state === AppState.update) {
          // call twice to ensure the correct position as a workaround
          setTimeout(updatePosition);
          setTimeout(updatePosition);
        }
      });
    }

    this.$app.registerWindowEventListener("resize", updatePosition);

    return { targetRef, containerRef, updatePosition };
  },
);

declare module "refina" {
  interface ContextFuncs<C> {
    usePositioning: never extends C
      ? (
          options: PositioningOptions,
          enabled?: boolean,
        ) => UsePositioninggResult
      : never;
  }
}
