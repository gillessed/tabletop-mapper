import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgCircle } from '../renderers/SvgCircle';

export namespace CircleFeature {
  export interface Props {
    feature: Model.Types.Feature<Model.Types.Circle>;
  }
}

const StrokeWidth = 0.05;

export const CircleFeature = React.memo(function CircleFeature({
  feature,
}: CircleFeature.Props) {
  const { geometry } = feature;
  return (
    <SvgCircle
      circle={geometry}
      strokeWidth={StrokeWidth}
    />
  );
});

