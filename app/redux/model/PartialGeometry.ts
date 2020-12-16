import { rectifyRectangle } from '../../math/RectifyGeometry';
import { Coordinate, same, coordinateDistance } from '../../math/Vector';
import { Model } from './ModelTypes';
import { curry2, swapArgs2 } from '../../utils/functionalSugar';
import { visitGeometry } from './ModelVisitors';

export interface AddCoordinateResult {
  geometry: Partial<Model.Types.Geometry>;
  complete: boolean;
}

export function addCoordinateToPartialGeometry(geometry: Partial<Model.Types.Geometry>, coordinate: Coordinate): AddCoordinateResult {
  return visitGeometry({
    visitPoint: curry2(swapArgs2(addCoordinateToPointGeometry))(coordinate),
    visitRectangle: curry2(swapArgs2(addCoordinateToRectangleGeometry))(coordinate),
    visitPath: curry2(swapArgs2(addCoordinateToPathGeometry))(coordinate),
    visitCircle: curry2(swapArgs2(addCoordinateToCircleGeometry))(coordinate),
  }, geometry as Model.Types.Geometry);
}

function addCoordinateToPointGeometry(partial: Partial<Model.Types.Point>, coordinate: Coordinate): AddCoordinateResult {
  const point: Model.Types.Point = {
    ...partial,
    type: 'point',
    p: coordinate,
  };
  return {
    geometry: point,
    complete: true,
  };
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
  if (currentPath.length > 1 && same(currentPath[0], coordinate)) {
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

function addCoordinateToCircleGeometry(partial: Partial<Model.Types.Circle>, coordinate: Coordinate): AddCoordinateResult {
  if (!partial.p) {
    const circle: Partial<Model.Types.Circle> = {
      ...partial,
      p: coordinate,
    };
    return {
      geometry: circle,
      complete: false,
    };
  } else {
    const r = coordinateDistance(partial.p, coordinate);
    if (r === 0) {
      return { geometry: partial, complete: false };
    }
    const circle: Partial<Model.Types.Circle> = {
      ...partial,
      r,
    };
    return {
      geometry: circle,
      complete: true,
    };
  }
}
