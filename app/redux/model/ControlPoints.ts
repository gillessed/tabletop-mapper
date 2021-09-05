import { Model } from "./ModelTypes";
import { Coordinate, Transform } from "../../math/Vector";
import { visitFeature, visitGeometry } from "./ModelVisitors";
import { OutlinePixelStrokeWidth } from "./FeatureOutline";
import { expandRectangle } from "../../math/ExpandGeometry";

export type ControlPoint = RectangleControlPoint | PathControlPoint;

export type RectangleResizeMode = 'up' | 'up-right' | 'right' | 'down-right' | 'down' | 'down-left' | 'left' | 'up-left'

export interface RectangleControlPoint {
  type: 'rectangle';
  id: string;
  featureId: string;
  rectangle: Model.Types.Rectangle;
  cursor: string;
  mode: RectangleResizeMode;
}

export interface PathControlPoint {
  type: 'path';
  id: string;
  featureId: string;
  rectangle: Model.Types.Rectangle;
  cursor: string;
  index: number;
}

export function getRectangleControlPoints(
  transform: Transform,
  featureId: string,
  geometry: Model.Types.Rectangle,
): ControlPoint[] {
  const scaledSize = transform.applyScalar(OutlinePixelStrokeWidth);
  const expansion = transform.applyScalar(8);
  const { p1, p2 } = geometry;
  const midX = p1.x + (p2.x - p1.x) / 2;
  const midY = p1.y + (p2.y - p1.y) / 2;
  const up: ControlPoint = {
    type: 'rectangle',
    id: `up-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: midX - scaledSize / 2, y: p1.y - scaledSize },
      p2: { x: midX + scaledSize / 2, y: p1.y },
    }, expansion),
    mode: 'up',
    cursor: 'n-resize',
  };
  const upRight: ControlPoint = {
    type: 'rectangle',
    id: `up-right-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p2.x, y: p1.y - scaledSize },
      p2: { x: p2.x + scaledSize, y: p1.y },
    }, expansion),
    mode: 'up-right',
    cursor: 'ne-resize',
  };
  const right: ControlPoint = {
    type: 'rectangle',
    id: `right-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p2.x, y: midY - scaledSize / 2 },
      p2: { x: p2.x + scaledSize, y: midY + scaledSize / 2 },
    }, expansion),
    mode: 'right',
    cursor: 'e-resize',
  };
  const downRight: ControlPoint = {
    type: 'rectangle',
    id: `down-right-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p2.x, y: p2.y },
      p2: { x: p2.x + scaledSize, y: p2.y + scaledSize },
    }, expansion),
    mode: 'down-right',
    cursor: 'se-resize',
  };
  const down: ControlPoint = {
    type: 'rectangle',
    id: `down-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: midX, y: p2.y },
      p2: { x: midX + scaledSize, y: p2.y + scaledSize },
    }, expansion),
    mode: 'down',
    cursor: 's-resize',
  };
  const downLeft: ControlPoint = {
    type: 'rectangle',
    id: `down-left-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p1.x - scaledSize, y: p2.y },
      p2: { x: p1.x, y: p2.y + scaledSize },
    }, expansion),
    mode: 'down-left',
    cursor: 'sw-resize',
  };
  const left: ControlPoint = {
    type: 'rectangle',
    id: `left-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p1.x - scaledSize, y: midY - scaledSize / 2 },
      p2: { x: p1.x, y: midY + scaledSize / 2 },
    }, expansion),
    mode: 'left',
    cursor: 'w-resize',
  };
  const upLeft: ControlPoint = {
    type: 'rectangle',
    id: `up-left-${featureId}`,
    featureId,
    rectangle: expandRectangle({
      type: 'rectangle',
      p1: { x: p1.x - scaledSize, y: p1.y - scaledSize },
      p2: { x: p1.x, y: p1.y },
    }, expansion),
    mode: 'up-left',
    cursor: 'nw-resize',
  };
  return [up, upRight, right, downRight, down, downLeft, left, upLeft];
}

export function getControlPoints(transform: Transform, features: Model.Types.Feature[]): ControlPoint[] {
  const controlPoints: ControlPoint[] = [];
  for (const feature of features) {
    controlPoints.push(...visitGeometry({
      visitRectangle: (rectangle) => getRectangleControlPoints(transform, feature.id, rectangle),
      visitPath: () => [],
    }, feature.geometry));
  }
  return controlPoints;
}

export function getHoveredControlPoint(controlPoints: ControlPoint[], mouseCoordinate: Coordinate): ControlPoint | null {
  const { x: mx, y: my } = mouseCoordinate;
  for (const controlPoint of controlPoints) {
    const { p1, p2 } = controlPoint.rectangle;
    if (mx > p1.x && mx < p2.x && my > p1.y && my < p2.y) {
      return controlPoint;
    }
  }
  return null;
}