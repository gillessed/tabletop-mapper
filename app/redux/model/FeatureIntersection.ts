import { Line, lineIntersection } from "../../math/Line";
import { Coordinate, coordinateDistance, Transform, Vector } from "../../math/Vector";
import { getPairs } from "../../utils/array";
import { curry2Reverse } from '../../utils/functionalSugar';
import { Indexable } from "../utils/indexable";
import { Model } from "./ModelTypes";
import { visitFeature, visitStyle } from "./ModelVisitors";
import { DefaultSvgStyle } from "./DefaultStyles";

const SelectionPadding = 8;

function doesPointFeatureContain(
  feature: Model.Types.Feature<Model.Types.Point>,
  style: Model.Types.Style,
  coordinate: Coordinate,
  padding: number,
): boolean {
  return visitStyle({
    visitBasicAssetStyle: () => {
      return false;
    },
    visitSvgStyle: (svgStyle) => {
      const distance = svgStyle.pointRadius + padding;
      return coordinateDistance(feature.geometry.p, coordinate) < distance;
    }
  }, style);
}

function doesRectangleFeatureContain(
  feature: Model.Types.Feature<Model.Types.Rectangle>,
  style: Model.Types.Style,
  coordinate: Coordinate,
  padding: number,
): boolean {
  return visitStyle({
    visitBasicAssetStyle: () => {
      return false;
    },
    visitSvgStyle: (svgStyle) => {
      const totalPadding = padding + svgStyle.strokeWidth / 2;
      const { p1, p2 } = feature.geometry;
      const { x, y } = coordinate;
      return (
        x > p1.x - totalPadding &&
        y > p1.y - totalPadding &&
        x < p2.x + totalPadding &&
        y < p2.y + totalPadding
      );
    }
  }, style);
}

function doesCircleFeatureContain(
  feature: Model.Types.Feature<Model.Types.Circle>,
  style: Model.Types.Style,
  coordinate: Coordinate,
  padding: number,
): boolean {
  return visitStyle({
    visitBasicAssetStyle: () => {
      return false;
    },
    visitSvgStyle: (svgStyle) => {
      const { p, r } = feature.geometry;
      const distance = r + padding + svgStyle.strokeWidth / 2;
      return coordinateDistance(p, coordinate) < distance;
    },
  }, style);
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

function doesPathFeatureContain(
  feature: Model.Types.Feature<Model.Types.Path>,
  style: Model.Types.Style,
  coordinate: Coordinate,
  padding: number,
): boolean {
  const totalPadding = visitStyle({
    visitBasicAssetStyle: () => {
      return padding;
    },
    visitSvgStyle: (svgStyle) => {
      return padding + svgStyle.strokeWidth / 2;
    },
  }, style);
  for (const p of feature.geometry.path) {
    if (coordinateDistance(p, coordinate) < totalPadding) {
      return true;
    } 
  }
  const segments = getPairs(feature.geometry.path, feature.geometry.closed);
  const matchesSegment = !!segments.find(({p1, p2}) => doesSegmentContain(coordinate, totalPadding, p1, p2));
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
  style: Model.Types.Style,
  coordinate: Coordinate,
  padding?: number,
): boolean {
  const resolvedPadding = padding ?? 0;
  return visitFeature({
    visitPoint: curry2Reverse(doesPointFeatureContain)(style, coordinate, resolvedPadding),
    visitCircle: curry2Reverse(doesCircleFeatureContain)(style, coordinate, resolvedPadding),
    visitPath: curry2Reverse(doesPathFeatureContain)(style, coordinate, resolvedPadding),
    visitRectangle: curry2Reverse(doesRectangleFeatureContain)(style, coordinate, resolvedPadding),
  }, feature);
}

export function getHoveredFeatures(
  features: Indexable<Model.Types.Feature>,
  styles: Indexable<Model.Types.Style>,
  mouseGridCoordinate: Coordinate,
  transform: Transform,
) {
  const hoveredFeatures: string[] = [];
  const padding = transform.applyScalar(SelectionPadding);
  for (const featureId of features.all) {
    const feature = features.byId[featureId];
    const style = styles.byId[feature.styleId];
    if (doesFeatureContain(feature, style, mouseGridCoordinate, padding)) {
      hoveredFeatures.push(featureId);
    }
  }
  return hoveredFeatures;
}
