import { rectifyRectangle } from '../../math/RectifyGeometry';
import { Coordinate, coordinateEquals, coordinateDistance } from '../../math/Vector';
import { Model } from './ModelTypes';
import { curry2, swapArgs2 } from '../../utils/functionalSugar';
import { visitGeometry } from './ModelVisitors';

export interface AddCoordinateResult {
  geometry: Partial<Model.Types.Geometry>;
  complete: boolean;
}

export function addCoordinateToPartialGeometry(geometry: Partial<Model.Types.Geometry>, coordinate: Coordinate): AddCoordinateResult {
  return visitGeometry({
    visitRectangle: curry2(swapArgs2(addCoordinateToRectangleGeometry))(coordinate),
    visitPath: curry2(swapArgs2(addCoordinateToPathGeometry))(coordinate),
  }, geometry as Model.Types.Geometry);
}

function addCoordinateToRectangleGeometry(partial: Partial<Model.Types.Rectangle>, coordinate: Coordinate): AddCoordinateResult {
  if (!partial.p1) {
    const rectangle: Partial<Model.Types.Rectangle> = {
      ...partial,
      p1: coordinate,
    };
    return {
      geometry: rectangle,
      complete: false,
    };
  } else {
    if (coordinateEquals(partial.p1, coordinate)) {
      return { geometry: partial, complete: false };
    }
    const rectangle: Partial<Model.Types.Rectangle> = {
      ...partial,
      p2: coordinate,
    };
    return {
      geometry: rectifyRectangle(rectangle as Model.Types.Rectangle),
      complete: true,
    };
  }
}

function addCoordinateToPathGeometry(partial: Partial<Model.Types.Path>, coordinate: Coordinate): AddCoordinateResult {
  const currentPath = partial.path ?? [];
  if (currentPath.length > 1 && coordinateEquals(currentPath[0], coordinate)) {
    const path: Partial<Model.Types.Path> = {
      ...partial,
      closed: true,
    };
    return {
      geometry: path,
      complete: true,
    };
  } else {
    const points = [...(partial.path ?? []), coordinate];
    const path: Partial<Model.Types.Path> = {
      ...partial,
      path: points,
    };
    return {
      geometry: path,
      complete: false,
    };
  }
}
