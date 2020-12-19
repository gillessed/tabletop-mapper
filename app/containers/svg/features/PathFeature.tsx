import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgPath } from '../renderers/SvgPath';
import { visitStyle } from '../../../redux/model/ModelVisitors';

export namespace PathFeature {
  export interface Props {
    geometry: Model.Types.Path;
    style: Model.Types.Style;
  }
}

export const PathFeature = React.memo(function PathFeature({
  geometry, style
}: PathFeature.Props) {
  return visitStyle({
    visitSvgStyle: (svgStyle: Model.Types.SvgStyle) => <SvgPath pathGeometry={geometry} style={svgStyle} />,
    visitBasicAssetStyle: () => null,
  }, style);
});
