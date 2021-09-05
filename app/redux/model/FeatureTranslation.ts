import { Model } from "./ModelTypes";
import { Coordinate, Transform, Vector } from "../../math/Vector";
import { visitFeature, visitGeometry } from "./ModelVisitors";
import { curry2 } from "../../utils/functionalSugar";

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

export function translateGeometry(
  geometry: Model.Types.Geometry,
  translation: Coordinate,
): Model.Types.Geometry {
  const newGeometry = visitGeometry<Model.Types.Geometry>({
    visitPath: curry2(translatePath)(translation),
    visitRectangle: curry2(translateRectangle)(translation),
  }, geometry);
  return newGeometry;
}

export function translateFeature(
  feature: Model.Types.Feature,
  translation: Coordinate,
): Model.Types.Feature {
  const newGeometry = translateGeometry(feature.geometry, translation);
  return { ...feature, geometry: newGeometry } as Model.Types.Feature;
}

export function getDragPoint(geometry: Model.Types.Geometry): Coordinate {
  return visitGeometry({
    visitRectangle: (rectangle) => rectangle.p1,
    visitPath: (path) => path.path[0],
  }, geometry);
}


export function getFeatureTranslation(
  mousePosition: Coordinate,
  mouseDragOrigin: Coordinate,
  transform: Transform,
  geometries: Model.Types.Geometry[],
): Coordinate {
  const snapToGrid = !!geometries.find((feature) => feature.snapToGrid);
  const originGridCoordinate = transform.applyC(mouseDragOrigin);
  const mousePositionVector = Vector.of(mousePosition);
  const mouseGridCoordinate = transform.applyV(mousePositionVector);
  let translation = mouseGridCoordinate.subtract(originGridCoordinate);
  if (snapToGrid) {
    const dragGridCoordinate = Vector.of(getDragPoint(geometries[0]));
    const translatedDragGridCoordinate = dragGridCoordinate.add(translation);
    const rounding = translatedDragGridCoordinate.subtract(translatedDragGridCoordinate.round());
    translation = translation.subtract(rounding);
  }
  return translation;
}
