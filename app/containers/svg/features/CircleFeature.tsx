import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgCircle } from '../renderers/SvgCircle';
import { visitStyle } from '../../../redux/model/ModelVisitors';

export namespace CircleFeature {
  export interface Props {
    geometry: Model.Types.Circle;
    style: Model.Types.Style;
  }
}

export const CircleFeature = React.memo(function CircleFeature({
  geometry, style,
}: CircleFeature.Props) {
  return visitStyle({
    visitSvgStyle: (svgStyle: Model.Types.SvgStyle) => <SvgCircle circle={geometry} style={svgStyle} />,
    visitBasicAssetStyle: () => null,
  }, style);
});

