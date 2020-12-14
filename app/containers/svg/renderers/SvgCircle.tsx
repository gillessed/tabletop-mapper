import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgCircle { 
  export interface Props {
    circle: Model.Types.Circle;
    strokeWidth: number;
    strokeOpacity?: number;
  }
}

export const SvgCircle = React.memo(function SvgCircle({
  circle,
  strokeWidth,
  strokeOpacity,
}: SvgCircle.Props) {
  const { p, r } = circle;
  return (
    <circle
      stroke='black'
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity ?? 1}
      fill='none'
      cx={p.x}
      cy={p.y}
      r={r}
    />
  );
});
