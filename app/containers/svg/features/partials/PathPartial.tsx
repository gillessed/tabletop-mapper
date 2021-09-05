import * as React from "react";
import { useSelector } from "react-redux";
import { Grid } from "../../../../redux/grid/GridTypes";
import { Model } from "../../../../redux/model/ModelTypes";

export namespace PathPartial { 
  export interface Props {
    pathGeometry: Model.Types.Path;
  }
}

export const PathPartial = React.memo(({
  pathGeometry,
}: PathPartial.Props) => {
  const transform = useSelector(Grid.Selectors.getTransform);
  const strokeWidth = transform.applyScalar(2);
  const { path } = pathGeometry;
  const [first, ...rest] = path;
  const pathStart = `M${first.x} ${first.y}`;
  const pathMoves = rest.map((coordinate) => `L${coordinate.x} ${coordinate.y}`).join(' ');
  const pathDefinition = `${pathStart} ${pathMoves} Z`;
  return (
    <path
      stroke='#000000'
      strokeWidth={strokeWidth}
      fill='none'
      strokeLinejoin='round'
      d={pathDefinition}
    />
  );
});