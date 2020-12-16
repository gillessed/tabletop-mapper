import { Model } from "../redux/model/ModelTypes";

export function rectifyRectangle(rectangle: Model.Types.Rectangle): Model.Types.Rectangle {
  const x = [rectangle.p1.x, rectangle.p2.x];
  const y = [rectangle.p1.y, rectangle.p2.y];
  return {
    ...rectangle,
    p1: { x: Math.min(...x), y: Math.min(...y) },
    p2: { x: Math.max(...x), y: Math.max(...y) },
  }
}
