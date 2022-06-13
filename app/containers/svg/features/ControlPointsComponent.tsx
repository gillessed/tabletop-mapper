import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '../../../redux/grid/GridTypes';
import { ControlPoint } from '../../../redux/model/ControlPoints';

export interface ControlPointsComponentProps {
  controlPoints: ControlPoint[];
  strokeColor: string;
}

export const ControlPointsComponent = React.memo(({
  controlPoints,
  strokeColor,
}: ControlPointsComponentProps) => {
  const transform = useSelector(Grid.Selectors.getTransform);
  const strokeWidth = transform.applyScalar(1);
  const controlPointSvgs = [];
  for (const controlPoint of controlPoints) {
    const { p1, p2 } = controlPoint.rectangle;
    controlPointSvgs.push(<rect
      id={controlPoint.id}
      x={p1.x}
      y={p1.y}
      width={p2.x - p1.x}
      height={p2.y - p1.y}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      fill={Colors.WHITE}
      cursor={controlPoint.cursor}
    />);
  }
  return <g>{controlPointSvgs}</g>;
});
