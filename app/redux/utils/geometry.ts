import { Model } from "../model/ModelTypes";

export function expandRectangle(
  rectangle: Model.Types.Rectangle,
  delta: number,
): Model.Types.Rectangle {
  const { p1, p2 } = rectangle;
  const result: Model.Types.Rectangle = {
    ...rectangle,
    p1: { x: p1.x - delta / 2, y: p1.y - delta / 2 },
    p2: { x: p2.x + delta / 2, y: p2.y + delta / 2 },
  };
  return result;
}

export function expandCircle(
  circle: Model.Types.Circle,
  delta: number,
): Model.Types.Circle {
  const { r } = circle;
  const outline: Model.Types.Circle = {
    ...circle,
    r: r + delta,
  };
  return outline;
}
