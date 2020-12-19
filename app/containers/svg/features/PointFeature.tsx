import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgPoint } from '../renderers/SvgPoint';
import { visitStyle } from '../../../redux/model/ModelVisitors';

export namespace PointFeature {
  export interface Props {
    geometry: Model.Types.Point;
    style: Model.Types.Style;
  }
}

export const PointFeature = React.memo(function PointFeature({
  geometry, style,
}: PointFeature.Props) {
  return visitStyle({
    visitSvgStyle: (svgStyle: Model.Types.SvgStyle) => <SvgPoint point={geometry} style={svgStyle} />,
    visitBasicAssetStyle: () => null,
  }, style);
});
