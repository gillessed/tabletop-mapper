import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';

export namespace SvgPath { 
  export interface Props {
    pathGeometry: Model.Types.Path;
    strokeWidth: number;
    strokeOpacity?: number;
  }
}

export const SvgPath = React.memo(function SvgPath({
  pathGeometry,
  strokeWidth,
  strokeOpacity,
}: SvgPath.Props) {
  const { path } = pathGeometry;
  const [first, ...rest] = path;
  const pathStart = `M${first.x} ${first.y}`;
  const pathMoves = rest.map((coordinate) => `L${coordinate.x} ${coordinate.y}`).join(' ');
  const closedPath = pathGeometry.closed ? ' Z' : '';
  const pathDefinition = `${pathStart} ${pathMoves} ${closedPath}`;
  return (
    <path
      stroke='black'
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity ?? 1}
      fill='none'
      d={pathDefinition}
    />
  );
});
