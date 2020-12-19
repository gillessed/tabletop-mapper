import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { visitGeometry } from '../../../redux/model/ModelVisitors';
import { PointFeature } from './PointFeature';
import { RectangleFeature } from './RectangleFeature';
import { PathFeature } from './PathFeature';
import { CircleFeature } from './CircleFeature';

export namespace Feature {
  export interface Props {
    geometry: Model.Types.Geometry;
    style: Model.Types.Style;
  }
}

export const Feature = React.memo(function Feature({
  geometry, style,
}: Feature.Props) {
  return visitGeometry({
    visitPoint: (point: Model.Types.Point) => {
      return <PointFeature geometry={point} style={style}/>;
    },
    visitRectangle: (rectangle: Model.Types.Rectangle) => {
      return <RectangleFeature geometry={rectangle} style={style} />;
    },
    visitPath: (path: Model.Types.Path) => {
      return <PathFeature geometry={path} style={style}/>;
    },
    visitCircle: (circle: Model.Types.Circle) => {
      return <CircleFeature geometry={circle} style={style}/>;
    },
  }, geometry);
});
