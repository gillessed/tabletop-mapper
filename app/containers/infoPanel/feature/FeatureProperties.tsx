import * as React from 'react';
import { Model } from "../../../redux/model/ModelTypes";
import { visitFeature } from "../../../redux/model/ModelVisitors";
import { displayCoordinate, Coordinate } from "../../../math/Vector";
import { SnapsToGridSwitch } from "./SnapsToGridSwitch";
import { getPathLength } from '../../../redux/model/PathLength';
import { PathClosedSwitch } from "./PathClosedSwitch";

export interface DisplayProperty {
  name: string;
  row: React.ReactNode;
}

const Center = 'Center';
const Radius = 'Radius';
const Grid = 'Grid';
const TopLeft = 'Top Left';
const Dimensions = 'Dimensions';
const Closed = 'Closed';
const Vertices = 'Vertices';
const Length = 'Length';

function createSimpleProperty(name: string, value: string | number) {
  return { name, row: <div className='property-value'>{value}</div> };
}

function gridSnapProperty(feature: Model.Types.Feature) {
  return { name: Grid, row: <SnapsToGridSwitch feature={feature} /> };
}

function cutNumber(n: number, digits: number = 2) {
  const factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}

function cutCoordinate(coordinate: Coordinate, digits: number = 2) {
  const { x, y } = coordinate;
  return { x: cutNumber(x, digits), y: cutNumber(y, digits) };
}

function getPointFeatureProperties(point: Model.Types.Feature<Model.Types.Point>) {
  const centerPoint = createSimpleProperty(Center, displayCoordinate(cutCoordinate(point.geometry.p)));
  const gridSnap = gridSnapProperty(point);
  return [centerPoint, gridSnap];
}

function getCircleFeatureProperties(circle: Model.Types.Feature<Model.Types.Circle>) {
  const { p, r } = circle.geometry;
  const centerPoint = createSimpleProperty(Center, displayCoordinate(cutCoordinate(p)));
  const radius = createSimpleProperty(Radius, cutNumber(r));
  const gridSnap = gridSnapProperty(circle);
  return [centerPoint, radius, gridSnap];
}

function getRectangleFeatureProperties(rectangle: Model.Types.Feature<Model.Types.Rectangle>) {
  const { p1, p2 } = rectangle.geometry;
  const topLeft = createSimpleProperty(TopLeft, displayCoordinate(cutCoordinate(p1)));
  const width = cutNumber(Math.abs(p2.x - p1.x));
  const height = cutNumber(Math.abs(p2.y - p1.y));
  const dimensionString = `${width} x ${height}`;
  const dimensions = createSimpleProperty(Dimensions, dimensionString);
  const gridSnap = gridSnapProperty(rectangle);
  return [topLeft, dimensions, gridSnap];
}

function getPathFeatureProperties(pathFeature: Model.Types.Feature<Model.Types.Path>) {
  const { path } = pathFeature.geometry;
  const vertices = createSimpleProperty(Vertices, path.length);
  const length = createSimpleProperty(Length, cutNumber(getPathLength(path)));
  const closed = {
    name: Closed,
    row: <PathClosedSwitch path={pathFeature} />
  }
  const gridSnap = gridSnapProperty(pathFeature);
  return [vertices, length, closed, gridSnap];
}

export function getFeatureProperties(feature: Model.Types.Feature): DisplayProperty[] {
  return visitFeature({
    visitPoint: getPointFeatureProperties,
    visitCircle: getCircleFeatureProperties,
    visitRectangle: getRectangleFeatureProperties,
    visitPath: getPathFeatureProperties,
  }, feature);
}
