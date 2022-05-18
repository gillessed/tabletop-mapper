import { Transform, Vector, Coordinate } from "../../math/Vector";
import { Model } from "./ModelTypes";
import { visitGeometry } from "./ModelVisitors";
import { Grid } from "../grid/GridTypes";
import { rectEquals } from "./ModelUtils";
import { rectifyRectangle } from "../../math/RectifyGeometry";

function resizeRectangleGeometry(
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

function resizePathGeometry(
  path: Model.Types.Path,
  resizeInfo: Grid.Types.ResizeInfo,
  newCoordinates: Coordinate,
): Model.Types.Path | null {
  return null;
}

export function resizeGeometry(
  transform: Transform,
  geometry: Model.Types.Geometry,
  resizeInfo: Grid.Types.ResizeInfo,
  mousePosition: Vector,
): Model.Types.Geometry | null {
  const snapsToGrid = !!geometry.snapToGrid;
  const mouseCoordinate = transform.applyV(mousePosition);
  const snappedCoordinate = snapsToGrid ? mouseCoordinate.round().getCoordinate() : mouseCoordinate.getCoordinate();

  const newGeometry = visitGeometry<Model.Types.Geometry | null>({
    visitPath: (path) => resizePathGeometry(path, resizeInfo, snappedCoordinate),
    visitRectangle: (rectangle) => resizeRectangleGeometry(rectangle, resizeInfo, snappedCoordinate),
  }, geometry);

  return newGeometry;
}
