import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgPath { 
  export interface Props {
    pathGeometry: Model.Types.Path;
    style: Model.Types.SvgStyle
  }
}

export const SvgPath = React.memo(function SvgPath({
  pathGeometry, style,
}: SvgPath.Props) {
  const { path } = pathGeometry;
  const [first, ...rest] = path;
  const pathStart = `M${first.x} ${first.y}`;
  const pathMoves = rest.map((coordinate) => `L${coordinate.x} ${coordinate.y}`).join(' ');
  const closedPath = pathGeometry.closed ? ' Z' : '';
  const pathDefinition = `${pathStart} ${pathMoves} ${closedPath}`;
  return (
    <path
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeOpacity={style.strokeOpacity}
      strokeLinejoin='round'
      fill='none'
      d={pathDefinition}
    />
  );
});
