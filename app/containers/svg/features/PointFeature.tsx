import * as React from 'react';
import { connect, useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/AppReducer';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgRectangle } from '../renderers/SvgRectangle';
import { Grid } from '../../../redux/grid/GridTypes';
import { SvgPoint } from '../renderers/SvgPoint';

export namespace PointFeature {
  export interface Props {
    feature: Model.Types.Feature<Model.Types.Point>;
  }
}

const PointRadius = 0.1;

export const PointFeature = React.memo(function PointFeature({
  feature,
}: PointFeature.Props) {
  const { geometry } = feature;
  return (
    <SvgPoint
      point={geometry}
      radius={PointRadius}
    />
  );
});
