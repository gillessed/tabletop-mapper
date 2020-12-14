import * as React from 'react';
import { Transform } from '../../../math/Vector';
import './Gridlines.scss';

export namespace GridLines {
  export interface Props {
    width: number;
    height: number;
    transform: Transform;
  }
}

const GridLineColor = '#394B59';
const GridLineOpacity = 0.5;

export const GridLines = React.memo(function GridLines({
  width,
  height,
  transform,
}: GridLines.Props) {
  const topLeft = transform.apply(0, 0);
  const bottomRight = transform.apply(width, height);

  const strokeWidth = 1 / transform.scale;
  const lines = [];

  for (let i = Math.floor(topLeft.x); i <= bottomRight.x; i++) {
    let classNames = "";
    let s = strokeWidth;
    if (i == 0) {
      s *= 2;
      classNames = "axis-gridline";
    }
    lines.push(<path
      className={classNames}
      d={`M${i} ${bottomRight.y} v ${topLeft.y - bottomRight.y}`}
      key={`vertical-${i}`}
      strokeWidth={s}
    />);
  }

  for (let i = Math.floor(topLeft.y); i <= bottomRight.y; i++) {
    let classNames = "";
    let s = strokeWidth;
    if (i == 0) {
      s *= 2;
      classNames = "axis-gridline";
    }
    lines.push(<path
      className={classNames}
      d={`M${bottomRight.x} ${i} h ${topLeft.x - bottomRight.x}`}
      key={`horizontal-${i}`}
      strokeWidth={s}
    />);
  }

  return (
    <g fill="transparent" stroke={GridLineColor} opacity={GridLineOpacity}>
      {lines}
    </g>
  );
});
