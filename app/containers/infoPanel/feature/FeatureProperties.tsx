import * as React from 'react';
import { Coordinate } from "../../../math/Vector";
import { Model } from "../../../redux/model/ModelTypes";
import { visitFeature } from "../../../redux/model/ModelVisitors";
import { SnapsToGridSwitch } from "./SnapsToGridSwitch";

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

function getBasicAssetFeatureProperties(pathFeature: Model.Types.BasicAssetFeature) {
  const gridSnap = gridSnapProperty(pathFeature);
  return [gridSnap];
}

function getPatternFeatureProperties(pathFeature: Model.Types.PatternFeature) {
  const gridSnap = gridSnapProperty(pathFeature);
  return [gridSnap];
}


export function getFeatureProperties(feature: Model.Types.Feature): DisplayProperty[] {
  return visitFeature({
    visitBasicAsset: getBasicAssetFeatureProperties,
    visitPattern: getPatternFeatureProperties,
  }, feature);
}
