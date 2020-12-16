import { Model } from "./ModelTypes";
import { visitFeature } from "./ModelVisitors";
import { PointRadius } from "../../containers/svg/features/PointFeature";
import { Coordinate, coordinateDistance, Vector } from "../../math/Vector";
import { curry3 } from '../../utils/functionalSugar';
import { number } from "prop-types";
import { getPairs } from "../../utils/array";
import { Line, lineIntersection } from "../../math/Line";

function doesPointFeatureContain(
  coordinate: Coordinate,
  padding: number,
  feature: Model.Types.Feature<Model.Types.Point>,
): boolean {
  const distance = PointRadius + padding;
  return coordinateDistance(feature.geometry.p, coordinate) < distance;
}

function doesRectangleFeatureContain(
  coordinate: Coordinate,
  padding: number,
  feature: Model.Types.Feature<Model.Types.Rectangle>,
): boolean {
  const { p1, p2 } = feature.geometry;
  const { x, y } = coordinate;
  return (
    x > p1.x - padding &&
    y > p1.y - padding &&
    x < p2.x + padding &&
    y < p2.y - padding
  );
}

function doesCircleFeatureContain(
  coordinate: Coordinate,
  padding: number,
  feature: Model.Types.Feature<Model.Types.Circle>,
): boolean {
  const { p, r } = feature.geometry;
  const distance = r + padding;
  return coordinateDistance(p, coordinate) < distance;
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
  console.log(intersections);
  console.log(segments.length);
  return intersections % 2 === 1;
}

function doesPathFeatureContain(
  coordinate: Coordinate,
  padding: number,
  feature: Model.Types.Feature<Model.Types.Path>,
): boolean {
  for (const p of feature.geometry.path) {
    if (coordinateDistance(p, coordinate) < padding) {
      return true;
    } 
  }
  const segments = getPairs(feature.geometry.path, feature.geometry.closed);
  const matchesSegment = !!segments.find(({p1, p2}) => doesSegmentContain(coordinate, padding, p1, p2));
  if (matchesSegment) {
    return true;
  }
  if (!feature.geometry.closed) {
    return false;
  }
  return doesPolygonContain(coordinate, segments); 
}

export function doesFeatureContain(
  feature: Model.Types.Feature,
  coordinate: Coordinate,
  padding?: number,
): boolean {
  const resolvedPadding = padding ?? 0;
  return visitFeature({
    visitPoint: curry3(doesPointFeatureContain)(coordinate)(resolvedPadding),
    visitCircle: curry3(doesCircleFeatureContain)(coordinate)(resolvedPadding),
    visitPath: curry3(doesPathFeatureContain)(coordinate)(resolvedPadding),
    visitRectangle: curry3(doesRectangleFeatureContain)(coordinate)(resolvedPadding),
  }, feature);
}
