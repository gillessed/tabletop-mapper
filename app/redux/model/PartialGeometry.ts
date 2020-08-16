import { rectifyRectangle } from '../../math/RectifyGeometry';
import { Coordinate } from '../../math/Vector';
import { Model } from './ModelTypes';

export interface AddCoordinateResult {
  geometry: Partial<Model.Types.Geometry>;
  complete: boolean;
}

export function addCoordinateToPartialGeometry(geometry: Partial<Model.Types.Geometry>, coordinate: Coordinate): AddCoordinateResult {
  switch (geometry.type) {
    case 'point': return addCoordinateToPointGeometry(geometry as Model.Types.Point, coordinate);
    case 'rectangle': return addCoordinateToRectangleGeometry(geometry as Model.Types.Rectangle, coordinate);
  }
  console.warn('Unknown geometry type ' + geometry.type);
  return { geometry, complete: true };
}

function addCoordinateToPointGeometry(_: Partial<Model.Types.Point>, coordinate: Coordinate): AddCoordinateResult {
  const point: Model.Types.Point = {
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