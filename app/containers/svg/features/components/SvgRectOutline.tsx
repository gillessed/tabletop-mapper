import { Model } from "../../../../redux/model/ModelTypes";
import * as React from 'react';
import { Transform } from "../../../../math/Vector";
import classNames from "classnames";
import { OutlinePixelStrokeWidth } from "../../../../redux/model/FeatureOutline";
import "./SvgRectOutline.scss";

export interface SvgRectOutlineProps {
  geometry: Model.Types.Rectangle;
  transform: Transform;
  color: string;
  hoverCrosshair?: boolean;
  strokeWidthPixels?: number;
}

export const SvgRectOutline = React.memo(({
  geometry,
  transform,
  color,
  hoverCrosshair,
  strokeWidthPixels,
}: SvgRectOutlineProps) => {
  if (geometry === null) {
    return null;
  };
  const classes = classNames({
    ['hover-selected']: hoverCrosshair,
  });
  const strokeWidth = transform.applyScalar(strokeWidthPixels ?? OutlinePixelStrokeWidth);
  const { p1, p2 } = geometry;
  return (
    <rect
      x={p1.x - strokeWidth / 2}
      y={p1.y - strokeWidth / 2}
      width={p2.x - p1.x + strokeWidth}
      height={p2.y - p1.y + strokeWidth}
      fill='none'
      stroke={color}
      strokeWidth={strokeWidth}
      className={classes}
    />
  );
});