import { flip as baseFlip, Placement } from "@floating-ui/dom";
import type { PositioningOptions } from "../types";
import { resolvePositioningShorthand } from "../utils/resolvePositioningShorthand";
import { toFloatingUIPlacement } from "../utils/toFloatingUIPlacement";

export interface FlipMiddlewareOptions
  extends Pick<PositioningOptions, "fallbackPositions"> {
  hasScrollableElement?: boolean;
  container: HTMLElement | null;
  isRtl?: boolean;
}

export function flip(options: FlipMiddlewareOptions) {
  const { hasScrollableElement, fallbackPositions = [], isRtl } = options;

  const fallbackPlacements = fallbackPositions.reduce<Placement[]>(
    (acc, shorthand) => {
      const { position, align } = resolvePositioningShorthand(shorthand);
      const placement = toFloatingUIPlacement(align, position, isRtl);
      if (placement) {
        acc.push(placement);
      }
      return acc;
    },
    [],
  );

  return baseFlip({
    ...(hasScrollableElement && { boundary: "clippingAncestors" }),
    fallbackStrategy: "bestFit",
    ...(fallbackPlacements.length && { fallbackPlacements }),
  });
}
