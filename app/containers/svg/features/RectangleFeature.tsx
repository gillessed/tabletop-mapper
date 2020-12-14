import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgRectangle } from '../renderers/SvgRectangle';

export namespace RectangleFeature {
  export interface Props {
    feature: Model.Types.Feature<Model.Types.Rectangle>;
  }
}

const StrokeWidth = 0.05;

export const RectangleFeature = React.memo(function RectangleFeature({
  feature,
}: RectangleFeature.Props) {
  const { geometry } = feature;
  return (
    <SvgRectangle
      rectangle={geometry}
      strokeWidth={StrokeWidth}
    />
  );
});
