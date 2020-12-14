import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgPoint { 
  export interface Props {
    point: Model.Types.Point;
    radius: number;
    fillOpacity?: number;
  }
}

export const SvgPoint = React.memo(function SvgPoint({
  point,
  radius,
  fillOpacity,
}: SvgPoint.Props) {
  const { p } = point;
  return (
    <circle
      stroke='none'
      fill='black'
      fillOpacity={fillOpacity ?? 1}
      cx={p.x}
      cy={p.y}
      r={radius}
    />
  );
});
