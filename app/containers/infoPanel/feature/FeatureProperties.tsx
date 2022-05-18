import * as React from 'react';
import { Coordinate } from "../../../math/Vector";
import { Model } from "../../../redux/model/ModelTypes";
import { visitFeature } from "../../../redux/model/ModelVisitors";
import { SnapToGridSwitch } from "./components/SnapToGridSwitch";
import { MirroredSwitch } from "./components/MirroredSwitch";
import { OpacitySlider } from './components/OpacitySlider';
import { RotationSlider } from './components/RotationSlider';
import { ImageFillDropdown } from './components/ImageFillDropdown';

export interface DisplayProperty {
  name: string;
  row: React.ReactNode;
}

const Grid = 'Grid';
const Dimensions = 'Dimensions';
const Vertices = 'Vertices';
const Length = 'Length';
const Orientation = 'Orientation';
const Opacity = 'Opacity';
const Rotation = 'Rotation';
const Image = 'Image';

function createSimpleProperty(name: string, value: string | number) {
  return { name, row: <div className='property-value'>{value}</div> };
}

function getGridSnapProperty(feature: Model.Types.Feature) {
  return { name: Grid, row: <SnapToGridSwitch featureId={feature.id} snapToGrid={!!feature.geometry.snapToGrid} /> };
}

function getOpacityProperty(feature: Model.Types.Feature) {
  return { name: Opacity, row: <OpacitySlider featureId={feature.id} opacity={feature.opacity} /> };
}

function cutNumber(n: number, digits: number = 2) {
  const factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}

function cutCoordinate(coordinate: Coordinate, digits: number = 2) {
  const { x, y } = coordinate;
  return { x: cutNumber(x, digits), y: cutNumber(y, digits) };
}

function getBasicAssetFeatureProperties(basicAssetFeature: Model.Types.BasicAssetFeature) {
  const { id, mirrored, geometry, rotation, objectCover } = basicAssetFeature;
  const snapToGrid = !!geometry.snapToGrid;
  const gridSnapProperty = getGridSnapProperty(basicAssetFeature);
  const mirroredProperty = {
    name: Orientation, row:
      <MirroredSwitch
        featureId={id}
        mirrored={mirrored}
      />
  };
  const rotationProperty = {
    name: Rotation, row:
      <RotationSlider
        featureId={id}
        rotation={rotation}
        snapToGrid={snapToGrid}
      />
  };
  const opacityProperty = getOpacityProperty(basicAssetFeature);
  const imageProperty = {
    name: Image, row:
      <ImageFillDropdown
        featureId={id}
        imageFill={objectCover}
      />
  };
  return [
    gridSnapProperty,
    mirroredProperty,
    rotationProperty,
    opacityProperty,
    imageProperty,
  ];
}

function getPatternFeatureProperties(pathFeature: Model.Types.PatternFeature) {
  const gridSnap = getGridSnapProperty(pathFeature);
  const opacity = getOpacityProperty(pathFeature);
  return [gridSnap, opacity];
}


export function getFeatureProperties(feature: Model.Types.Feature): DisplayProperty[] {
  return visitFeature({
    visitBasicAsset: getBasicAssetFeatureProperties,
    visitPattern: getPatternFeatureProperties,
  }, feature);
}
