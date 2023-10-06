import { computePosition } from "@floating-ui/dom";
import { Context, HTMLElementComponent, contextFuncs, ref } from "refina";
import { offset as offsetMidware, flip as flipMiddleware } from "./middleware";
import type { PositioningOptions, PositioningRefs } from "./types";
import { toFloatingUIPlacement } from "./utils/toFloatingUIPlacement";

contextFuncs.usePositioning = function (
  this: Context,
  _ckey: string,
  { offset, align, position, fallbackPositions }: PositioningOptions = {},
  enabled: boolean = true,
): PositioningRefs {
  if (!enabled) return { targetRef: ref(), containerRef: ref() };

  const targetRef = ref<HTMLElementComponent>(),
    containerRef = ref<HTMLElementComponent>();
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
};

declare module "refina" {
  interface CustomContext<C> {
    usePositioning: never extends C
      ? (options: PositioningOptions, enabled?: boolean) => PositioningRefs
      : never;
  }
}
