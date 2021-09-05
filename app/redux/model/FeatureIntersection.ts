import { Line, lineIntersection } from "../../math/Line";
import { Coordinate, coordinateDistance, Transform, Vector } from "../../math/Vector";
import { getPairs } from "../../utils/array";
import { curry2Reverse } from '../../utils/functionalSugar';
import { Indexable } from "../utils/indexable";
import { Model } from "./ModelTypes";
import { visitGeometry } from "./ModelVisitors";

const SelectionPadding = 8;

function doesRectangleGeometryContain(
  geometry: Model.Types.Rectangle,
  coordinate: Coordinate,
  padding: number,
): boolean {
  const { p1, p2 } = geometry;
  const { x, y } = coordinate;
  return (
    x > p1.x - padding &&
    y > p1.y - padding &&
    x < p2.x + padding &&
    y < p2.y + padding
  );
}

function doesSegmentContain(
  c: Coordinate,
  padding: number,
  p1: Coordinate,
  p2: Coordinate,
) {
  const segmentVector = new Vector(p2.x - p1.x, p2.y - p1.y);
  const pointVector = new Vector(c.x - p1.x, c.y - p1.y);
  const reverseVector = segmentVector.scalarMultiply(-1);
  const pointVector2 = new Vector(c.x - p2.x, c.y - p2.y);
  const normalUnit = segmentVector.normalUnit();
  const distance = Math.abs(normalUnit.dot(pointVector));
  if (segmentVector.dot(pointVector) > 0 && reverseVector.dot(pointVector2) > 0) {
    return distance < padding;
  }
}

function doesPolygonContain(
  coordinate: Coordinate,
  segments: { p1: Coordinate, p2: Coordinate}[],
) {
  const ray: Line = {
    p1: coordinate,
    p2: { x: coordinate.x + 1, y: coordinate.y + 1},
    p1Bound: true,
    p2Bound: false,
  };
  let intersections = 0;
  for (const segment of segments) {
    const segmentLine: Line = {
      ...segment,
      p1Bound: true,
      p2Bound: true,
    }
    if (lineIntersection(ray, segmentLine) != null)  {
      intersections++;
    }
  }
  return intersections % 2 === 1;
}

function doesPathGeometryContain(
  geometry: Model.Types.Path,
  coordinate: Coordinate,
  padding: number,
): boolean {
  for (const p of geometry.path) {
    if (coordinateDistance(p, coordinate) < padding) {
      return true;
    } 
  }
  const segments = getPairs(geometry.path, geometry.closed);
  const matchesSegment = !!segments.find(({p1, p2}) => doesSegmentContain(coordinate, padding, p1, p2));
  if (matchesSegment) {
    return true;
  }
  if (!geometry.closed) {
    return false;
  }
  return doesPolygonContain(coordinate, segments); 
}

export function doesGeometryContain(
  geometry: Model.Types.Geometry,
  coordinate: Coordinate,
  padding?: number,
): boolean {
  const resolvedPadding = padding ?? 0;
  return visitGeometry({
    visitPath: curry2Reverse(doesPathGeometryContain)(coordinate, resolvedPadding),
    visitRectangle: curry2Reverse(doesRectangleGeometryContain)(coordinate, resolvedPadding),
  }, geometry);
}

export function getHoveredFeatures(
  features: Indexable<Model.Types.Feature>,
  mouseGridCoordinate: Coordinate,
  transform: Transform,
) {
  const hoveredFeatures: string[] = [];
  const padding = transform.applyScalar(SelectionPadding);
  for (const featureId of features.all) {
    const feature = features.byId[featureId];
    if (doesGeometryContain(feature.geometry, mouseGridCoordinate, padding)) {
      hoveredFeatures.push(featureId);
    }
  }
  return hoveredFeatures;
}
