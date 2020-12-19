import * as React from 'react';
import { useSelector } from 'react-redux';
import { rectifyRectangle } from '../../../math/RectifyGeometry';
import { coordinateDistance } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { DefaultSvgStyle } from '../../../redux/model/DefaultStyles';
import { Model } from '../../../redux/model/ModelTypes';
import { visitGeometry } from '../../../redux/model/ModelVisitors';
import { SvgCircle } from '../renderers/SvgCircle';
import { SvgPath } from '../renderers/SvgPath';
import { SvgPoint } from '../renderers/SvgPoint';
import { SvgRectangle } from '../renderers/SvgRectangle';

const PartialSvgStyle: Model.Types.SvgStyle = {
  ...DefaultSvgStyle,
  id: 'PartialSvgStyle',
  name: 'Partial Svg Style',
  strokeOpacity: 0.5,
}

export const FeaturePartialGeometries = function FeaturePartialGeometries() {
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

  function renderPoint({ snapToGrid }: { snapToGrid?: boolean }) {
    const p = getMousePoint(snapToGrid);
    return (
      <SvgPoint
        point={{ type: 'point', p }}
        style={PartialSvgStyle}
      />
    );

  }

  function renderRectangle(rectangle: Model.Types.Rectangle) {
    const p1 = getMousePoint(rectangle.snapToGrid);
    const p2 = rectangle.p1 != null ? { x: rectangle.p1.x, y: rectangle.p1.y } : undefined;
    const rectifiedRectangle = p2 != null ? rectifyRectangle({ type: 'rectangle', p1, p2 }) : undefined;
    return (
      <>
        {renderPoint(rectangle)}
        {rectifiedRectangle && <SvgRectangle rectangle={rectifiedRectangle} style={PartialSvgStyle} />}
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
        {renderPoint(pathGeometry)}
        <SvgPath pathGeometry={fullPathGeometry} style={PartialSvgStyle} />
      </>
    );
  }

  function renderCircle(circle: Model.Types.Circle) {
    if (!circle.p) {
      return renderPoint(circle);
    } else {
      const mousePoint = getMousePoint(circle.snapToGrid);
      const r = coordinateDistance(mousePoint, circle.p);
      const fullCircle = {
        ...circle,
        r,
      };
      return (
        <>
          <SvgPoint point={{ type: 'point', p: circle.p }} style={PartialSvgStyle} />
          {renderPoint(circle)}
          <SvgCircle circle={fullCircle} style={PartialSvgStyle} />
        </>
      );
    }
  }

  return visitGeometry({
    visitPoint: renderPoint,
    visitRectangle: renderRectangle,
    visitPath: renderPath,
    visitCircle: renderCircle,
  }, partialGeometry as Model.Types.Geometry);
};
