import { computePosition } from "@floating-ui/dom";
import { addCustomContextFunc, ref } from "refina";
import { flip as flipMiddleware, offset as offsetMidware } from "./middleware";
import type { PositioningOptions, PositioningRefs } from "./types";
import { toFloatingUIPlacement } from "./utils/toFloatingUIPlacement";

addCustomContextFunc(
  "usePositioning",
  function (
    _ckey: string,
    options: PositioningOptions = {},
    enabled: boolean = true,
  ): PositioningRefs {
    const targetRef = options.targetRef ?? ref(),
      containerRef = options.containerRef ?? ref();

    if (!enabled) return { targetRef, containerRef };

    const { align, position, offset, fallbackPositions } = options;

    this.$app.pushHook("afterModifyDOM", () => {
      if (targetRef.current == null || containerRef.current == null) {
        throw new Error("targetRef or containerRef of useFloating is not set");
      }
      const targetNode = targetRef.current.node,
        containerNode = containerRef.current.node;

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
    });
    return { targetRef, containerRef };
  },
);

declare module "refina" {
  interface CustomContext<C> {
    usePositioning: never extends C
      ? (options: PositioningOptions, enabled?: boolean) => PositioningRefs
      : never;
  }
}
