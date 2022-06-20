import { Model } from "../redux/model/ModelTypes";

export function boundRectangleWithin(rect: Model.Types.Rectangle, bounds: Model.Types.Rectangle): Model.Types.Rectangle {
  const { p1, p2 } = rect;
  const { p1: b1, p2: b2 } = bounds;
  return {
    ...rect,
    p1: {
      x: Math.max(p1.x, b1.x),
      y: Math.max(p1.y, b1.y),
    },
    p2: {
      x: Math.min(p2.x, b2.x),
      y: Math.min(p2.y, b2.y),
    },
  };
}