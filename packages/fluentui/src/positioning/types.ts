import { PrimaryElRef } from "refina";

export interface UsePositioninggResult {
  targetRef: PrimaryElRef;
  containerRef: PrimaryElRef;
  updatePosition: () => void;
}

export type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type OffsetFunctionParam = {
  positionedRect: Rect;
  targetRect: Rect;
  position: Position;
  alignment?: Alignment;
};

export type OffsetObject = { crossAxis?: number; mainAxis: number };

export type OffsetShorthand = number;

export type OffsetFunction = (
  param: OffsetFunctionParam,
) => OffsetObject | OffsetShorthand;

export type Offset = OffsetFunction | OffsetObject | OffsetShorthand;

export type Position = "above" | "below" | "before" | "after";
export type Alignment = "top" | "bottom" | "start" | "end" | "center";

export type PositioningShorthandValue =
  | "above"
  | "above-start"
  | "above-end"
  | "below"
  | "below-start"
  | "below-end"
  | "before"
  | "before-top"
  | "before-bottom"
  | "after"
  | "after-top"
  | "after-bottom";

export interface PositioningOptions {
  /** Alignment for the component. Only has an effect if used with the @see position option */
  align?: Alignment;

  /**
   * Position for the component. Position has higher priority than align. If position is vertical ('above' | 'below')
   * and align is also vertical ('top' | 'bottom') or if both position and align are horizontal ('before' | 'after'
   * and 'start' | 'end' respectively),
   * then provided value for 'align' will be ignored and 'center' will be used instead.
   */
  position?: Position;

  /**
   * Lets you displace a positioned element from its reference element.
   * This can be useful if you need to apply some margin between them or if you need to fine tune the
   * position according to some custom logic.
   */
  offset?: Offset;

  /**
   * If flip fails to stop the positioned element from overflowing
   * its boundaries, use a specified fallback positions.
   */
  fallbackPositions?: PositioningShorthandValue[];

  targetRef?: PrimaryElRef;
  containerRef?: PrimaryElRef;

  immediate?: boolean;
}

/**
 * Public api that allows components using react-positioning to specify positioning options
 */
export interface PositioningProps
  extends Pick<PositioningOptions, "align" | "offset" | "position"> {
  /**
   * Manual override for the target element. Useful for scenarios where a component accepts user prop to override target
   */
  target?: HTMLElement | null;
}

export type PositioningShorthand = PositioningProps | PositioningShorthandValue;
