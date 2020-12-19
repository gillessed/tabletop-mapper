import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgRectangle { 
  export interface Props {
    rectangle: Model.Types.Rectangle;
    style: Model.Types.SvgStyle
  }
}

export const SvgRectangle = React.memo(function SvgRectangle({
  rectangle, style,
}: SvgRectangle.Props) {
  const { p1, p2 } = rectangle;
  return (
    <rect
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeOpacity={style.strokeOpacity}
      fill='none'
      x={p1.x}
      y={p1.y}
      width={p2.x - p1.x}
      height={p2.y - p1.y}
    />
  );
});
