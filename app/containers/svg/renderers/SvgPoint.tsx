import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgPoint { 
  export interface Props {
    point: Model.Types.Point;
    style: Model.Types.SvgStyle;
  }
}

export const SvgPointRadius = 0.1;

export const SvgPoint = React.memo(function SvgPoint({
  point,
  style,
}: SvgPoint.Props) {
  const { p } = point;
  // NOTE: (gcole) while points are under the hood fills, they use the stroke values
  // from the style to stay consistent with the default style having no fill.
  return (
    <circle
      stroke='none'
      fill={style.stroke}
      fillOpacity={style.strokeOpacity}
      cx={p.x}
      cy={p.y}
      r={style.pointRadius}
    />
  );
});
