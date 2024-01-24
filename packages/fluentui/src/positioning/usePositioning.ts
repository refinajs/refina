import { computePosition } from "@floating-ui/dom";
import { $contextFunc, AppState, _, ref } from "refina";
import { flip as flipMiddleware, offset as offsetMidware } from "./middleware";
import type { PositioningOptions, UsePositioninggResult } from "./types";
import { toFloatingUIPlacement } from "./utils/toFloatingUIPlacement";

export const usePositioning = $contextFunc(
  (_ckey, app) =>
    (
      options: PositioningOptions = {},
      enabled: boolean = true,
    ): UsePositioninggResult => {
      const targetRef = options.targetRef ?? ref(),
        containerRef = options.containerRef ?? ref();

      if (_.$recvContext || !enabled)
        return { targetRef, containerRef, updatePosition: () => {} };

      const { align, position, offset, fallbackPositions } = options;

      const updatePosition = () => {
        if (
          !targetRef.current?.$primaryEl ||
          !containerRef.current?.$primaryEl
        ) {
          throw new Error(
            "targetRef or containerRef of useFloating is not set or has no $primaryEl.",
          );
        }
        const targetNode = targetRef.current.$primaryEl.node,
          containerNode = containerRef.current.$primaryEl.node as HTMLElement;

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
        app.pushOnetimeHook("afterModifyDOM", () => {
          if (app.state === AppState.UPDATE) {
            // call twice to ensure the correct position as a workaround
            setTimeout(updatePosition);
            setTimeout(updatePosition);
          }
        });
      }

      if (_.$updateContext) {
        _.$window.addEventListener("resize", updatePosition);
      }

      return { targetRef, containerRef, updatePosition };
    },
);
