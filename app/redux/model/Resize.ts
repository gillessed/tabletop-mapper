import { Transform, Vector, Coordinate } from "../../math/Vector";
import { Model } from "./ModelTypes";
import { Grid } from "../grid/GridTypes";
import { rectEquals } from "./ModelUtils";
import { rectifyRectangle } from "../../math/RectifyGeometry";

export function resizeRectangleWithInfo(
  rectangle: Model.Types.Rectangle,
  resizeInfo: Grid.Types.ResizeInfo,
  newCoordinate: Coordinate,
): Model.Types.Rectangle | null {
  const mode = resizeInfo.rectMode;
  if (mode == null) {
    return null;
  }
  let newRectangle: Model.Types.Rectangle = { ...rectangle, p1: { ...rectangle.p1 }, p2: { ...rectangle.p2 } };
  const { x: nx, y: ny } = newCoordinate;
  switch (mode) {
    case 'up':
      newRectangle.p1.y = ny;
      break;
    case 'up-right':
      newRectangle.p1.y = ny;
      newRectangle.p2.x = nx;
      break;
    case 'right':
      newRectangle.p2.x = nx;
      break;
    case 'down-right':
      newRectangle.p2.y = ny;
      newRectangle.p2.x = nx;
      break;
    case 'down':
      newRectangle.p2.y = ny;
      break;
    case 'down-left':
      newRectangle.p2.y = ny;
      newRectangle.p1.x = nx;
      break;
    case 'left':
      newRectangle.p1.x = nx;
      break;
    case 'up-left':
      newRectangle.p1.y = ny;
      newRectangle.p1.x = nx;
      break;
}
  newRectangle = rectifyRectangle(newRectangle);
  if (rectEquals(rectangle, newRectangle)) {
    return rectangle;
  }
  return newRectangle;
}
export function resizeRectangle(
  transform: Transform,
  rectangle: Model.Types.Rectangle,
  resizeInfo: Grid.Types.ResizeInfo,
  mousePosition: Vector,
): Model.Types.Rectangle | null {
  const snapsToGrid = !!rectangle.snapToGrid;
  const mouseCoordinate = transform.applyV(mousePosition);
  const snappedCoordinate = snapsToGrid ? mouseCoordinate.round().getCoordinate() : mouseCoordinate.getCoordinate();

  return resizeRectangleWithInfo(rectangle, resizeInfo, snappedCoordinate);
}
