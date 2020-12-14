import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgPath } from '../renderers/SvgPath';

export namespace PathFeature {
  export interface Props {
    feature: Model.Types.Feature<Model.Types.Path>;
  }
}

const StrokeWidth = 0.05;

export const PathFeature = React.memo(function PathFeature({
  feature,
}: PathFeature.Props) {
  const { geometry } = feature;
  return (
    <SvgPath
      pathGeometry={geometry}
      strokeWidth={StrokeWidth}
    />
  );
});
