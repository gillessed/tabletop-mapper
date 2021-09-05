import * as React from "react";
import { useSelector } from "react-redux";
import { Grid } from "../../../../redux/grid/GridTypes";
import { Model } from "../../../../redux/model/ModelTypes";

export namespace RectanglePartial { 
  export interface Props {
    rectangle: Model.Types.Rectangle;
  }
}

export const RectanglePartial = React.memo(({
  rectangle,
}: RectanglePartial.Props) => {
  const transform = useSelector(Grid.Selectors.getTransform);
  const strokeWidth = transform.applyScalar(2);
  const { p1, p2 } = rectangle;
  return (
    <rect
      stroke='#000000'
      strokeWidth={strokeWidth}
      fill='none'
      x={p1.x}
      y={p1.y}
      width={p2.x - p1.x}
      height={p2.y - p1.y}
    />
  );
});