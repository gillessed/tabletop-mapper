import { Model } from "./ModelTypes";

export function rectToSvg(rect: Model.Types.Rectangle) {
  const { p1, p2 } = rect;
  return {
    x: p1.x,
    y: p1.y,
    width: p2.x - p1.x,
    height: p2.y - p1.y,
  };
}