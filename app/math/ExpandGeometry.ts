import { Model } from "../redux/model/ModelTypes";

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
