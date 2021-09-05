import * as React from 'react';
import { useSelector } from 'react-redux';
import { rectifyRectangle } from '../../../../math/RectifyGeometry';
import { coordinateDistance } from '../../../../math/Vector';
import { Grid } from '../../../../redux/grid/GridTypes';
import { Model } from '../../../../redux/model/ModelTypes';
import { visitGeometry } from '../../../../redux/model/ModelVisitors';
import { PathPartial } from './PathPartial';
import { RectanglePartial } from './RectanglePartial';

export const FeaturePartialGeometries = () => {
  const partialGeometry = useSelector(Grid.Selectors.getPartialGeometry);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const transform = useSelector(Grid.Selectors.getTransform);

  if (partialGeometry == null || mousePosition == null) {
    return null;
  }

  function getMousePoint(snapToGrid?: boolean) {
    const mouseGridCoordinates = transform.applyV(mousePosition).getCoordinate();
    const roundedMouseGridCoordinates = transform.applyV(mousePosition).round().getCoordinate();
    return snapToGrid ? roundedMouseGridCoordinates : mouseGridCoordinates;
  }

  function renderRectangle(rectangle: Model.Types.Rectangle) {
    const p1 = getMousePoint(rectangle.snapToGrid);
    const p2 = rectangle.p1 != null ? { x: rectangle.p1.x, y: rectangle.p1.y } : undefined;
    const rectifiedRectangle = p2 != null ? rectifyRectangle({ type: 'rectangle', p1, p2 }) : undefined;
    return (
      <>
        {rectifiedRectangle && <RectanglePartial rectangle={rectifiedRectangle} />}
      </>
    );
  }

  function renderPath(pathGeometry: Model.Types.Path) {
    const p1 = getMousePoint(pathGeometry.snapToGrid);
    const fullPathGeometry = {
      ...pathGeometry,
      path: [...(pathGeometry.path ?? []), p1],
    };
    return (
      <>
        <PathPartial pathGeometry={fullPathGeometry} />
      </>
    );
  }

  return visitGeometry({
    visitRectangle: renderRectangle,
    visitPath: renderPath,
  }, partialGeometry as Model.Types.Geometry);
};
