import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgRectangle } from '../renderers/SvgRectangle';
import { visitStyle } from '../../../redux/model/ModelVisitors';

export namespace RectangleFeature {
  export interface Props {
    geometry: Model.Types.Rectangle;
    style: Model.Types.Style;
  }
}

export const RectangleFeature = React.memo(function RectangleFeature({
  geometry, style,
}: RectangleFeature.Props) {
  return visitStyle({
    visitSvgStyle: (svgStyle: Model.Types.SvgStyle) => <SvgRectangle rectangle={geometry} style={svgStyle} />,
    visitBasicAssetStyle: () => null,
  }, style);
});
