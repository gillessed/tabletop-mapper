import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgPoint } from '../renderers/SvgPoint';

export namespace PointFeature {
  export interface Props {
    feature: Model.Types.Feature<Model.Types.Point>;
  }
}

export const PointRadius = 0.1;

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
