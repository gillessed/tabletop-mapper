import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgCircle { 
  export interface Props {
    circle: Model.Types.Circle;
    style: Model.Types.SvgStyle;
  }
}

export const SvgCircle = React.memo(function SvgCircle({
  circle, style,
}: SvgCircle.Props) {
  const { p, r } = circle;
  return (
    <circle
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeOpacity={style.strokeOpacity}
      fill='none'
      cx={p.x}
      cy={p.y}
      r={r}
    />
  );
});
