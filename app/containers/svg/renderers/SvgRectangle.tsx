import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgRectangle { 
  export interface Props {
    rectangle: Model.Types.Rectangle;
    strokeWidth: number;
    strokeOpacity?: number;
  }
}

export const SvgRectangle = React.memo(function SvgRectangle({
  rectangle,
  strokeWidth,
  strokeOpacity
}: SvgRectangle.Props) {
  const { p1, p2 } = rectangle;
  return (
    <rect
      stroke='black'
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity ?? 1}
      fill='none'
      x={p1.x}
      y={p1.y}
      width={p2.x - p1.x}
      height={p2.y - p1.y}
    />
  );
});
