import { Model } from "./ModelTypes";
import { Coordinate, Transform, Vector } from "../../math/Vector";
import { visitFeature, visitGeometry } from "./ModelVisitors";
import { curry2 } from "../../utils/functionalSugar";

export function translatePoint(
  translation: Coordinate,
  geometry: Model.Types.Point,
): Model.Types.Point {
  const newPoint: Coordinate = {
    x: geometry.p.x + translation.x,
    y: geometry.p.y + translation.y,
  };
  return {
    ...geometry,
    p: newPoint,
  }
}

export function translateCircle(
  translation: Coordinate,
  geometry: Model.Types.Circle,
): Model.Types.Circle {
  const newCenterpoint: Coordinate = {
    x: geometry.p.x + translation.x,
    y: geometry.p.y + translation.y,
  };
  return {
    ...geometry,
    p: newCenterpoint,
  }
}

export function translateRectangle(
  translation: Coordinate,
  geometry: Model.Types.Rectangle,
): Model.Types.Rectangle {
  const { p1, p2 } = geometry;
  const newP1: Coordinate = {
    x: p1.x + translation.x,
    y: p1.y + translation.y,
  };
  const newP2: Coordinate = {
    x: p2.x + translation.x,
    y: p2.y + translation.y,
  };
  return {
    ...geometry,
    p1: newP1,
    p2: newP2,
  }
}

export function translatePath(
  translation: Coordinate,
  geometry: Model.Types.Path,
): Model.Types.Path {
  const newPath: Coordinate[] = [];
  for (const p of geometry.path) {
    newPath.push({
      x: p.x + translation.x,
      y: p.y + translation.y,
    })
  }
  return {
    ...geometry,
    path: newPath,
  }
}

export function translateFeature(
  feature: Model.Types.Feature,
  translation: Coordinate,
): Model.Types.Feature {
  const newGeometry = visitGeometry<Model.Types.Geometry>({
    visitPoint: curry2(translatePoint)(translation),
    visitCircle: curry2(translateCircle)(translation),
    visitPath: curry2(translatePath)(translation),
    visitRectangle: curry2(translateRectangle)(translation),
  }, feature.geometry);
  return { ...feature, geometry: newGeometry };
}

export function getDragPoint(feature: Model.Types.Feature): Coordinate {
  return visitFeature({
    visitPoint: (point) => point.geometry.p,
    visitRectangle: (rectangle) => rectangle.geometry.p1,
    visitCircle: (circle) => circle.geometry.p,
    visitPath: (path) => path.geometry.path[0],
  }, feature);
}


export function getFeatureTranslation(
  mousePosition: Coordinate,
  mouseDragOrigin: Coordinate,
  transform: Transform,
  features: Model.Types.Feature[],  
): Coordinate {
  const snapToGrid = !!features.find((feature) => feature.geometry.snapToGrid);
  const originGridCoordinate = transform.applyC(mouseDragOrigin);
  const mousePositionVector = Vector.of(mousePosition);
  const mouseGridCoordinate = transform.applyV(mousePositionVector);
  let translation = mouseGridCoordinate.subtract(originGridCoordinate);
  if (snapToGrid) {
    const dragGridCoordinate = Vector.of(getDragPoint(features[0]));
    const translatedDragGridCoordinate = dragGridCoordinate.add(translation);
    const rounding = translatedDragGridCoordinate.subtract(translatedDragGridCoordinate.round());
    translation = translation.subtract(rounding); 
  }
  return translation;
}
