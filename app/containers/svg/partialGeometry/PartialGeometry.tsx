import * as React from 'react';
import { useSelector } from 'react-redux';
import { rectifyRectangle } from '../../../math/RectifyGeometry';
import { Grid } from '../../../redux/grid/GridTypes';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgRectangle } from '../renderers/SvgRectangle';
import { SvgPoint } from '../renderers/SvgPoint';
import { SvgPath } from '../renderers/SvgPath';
import { SvgCircle} from '../renderers/SvgCircle';
import { coordinateDistance } from '../../../math/Vector';

const PartialPointRadius = 10;
const PartialStrokeWidth = 4;
const PartialOpacity = 0.5;

export const PartialGeometry = React.memo(function PartialGeometry() {
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

  function renderPoint(snapToGrid?: boolean) {
    const p = getMousePoint(snapToGrid);
    const radius = transform.applyScalar(PartialPointRadius);
    return (
      <SvgPoint
        point={{ type: 'point', p }}
        radius={radius}
        fillOpacity={PartialOpacity}
      />
    );

  }

  function renderRectangle(rectangle: Model.Types.Rectangle) {
    const strokeWidth = transform.applyScalar(PartialStrokeWidth);
    const p1 = getMousePoint(rectangle.snapToGrid);
    const p2 = rectangle.p1 != null ? { x: rectangle.p1.x, y: rectangle.p1.y } : undefined;
    const rectifiedRectangle = p2 != null ? rectifyRectangle({ type: 'rectangle', p1, p2 }) : undefined;
    return (
      <>
        {renderPoint(rectangle.snapToGrid)}
        {rectifiedRectangle && <SvgRectangle
          rectangle={rectifiedRectangle}
          strokeWidth={strokeWidth}
          strokeOpacity={PartialOpacity}
        />}
      </>
    );
  }

  function renderPath(pathGeometry: Model.Types.Path) {
    const strokeWidth = transform.applyScalar(PartialStrokeWidth);
    const p1 = getMousePoint(pathGeometry.snapToGrid);
    const fullPathGeometry = {
      ...pathGeometry,
      path: [...(pathGeometry.path ?? []), p1],
    };
    return (
      <>
        {renderPoint(pathGeometry.snapToGrid)}
        <SvgPath
          pathGeometry={fullPathGeometry}
          strokeWidth={strokeWidth}
          strokeOpacity={PartialOpacity}
        />
      </>
    );
  }

  function renderCircle(circle: Model.Types.Circle) {
    const strokeWidth = transform.applyScalar(PartialStrokeWidth);
    if (!circle.p) {
      return renderPoint(circle.snapToGrid);
    } else {
      const mousePoint = getMousePoint(circle.snapToGrid);
      const r = coordinateDistance(mousePoint, circle.p);
      const fullCircle = {
        ...circle,
        r,
      };
      return (
        <>
          {renderPoint(circle.snapToGrid)}
          <SvgCircle
            circle={fullCircle}
            strokeWidth={strokeWidth}
            strokeOpacity={PartialOpacity}
          />
        </>
      );
    }
  }

  switch (partialGeometry.type) {
    case 'point':
      return renderPoint(partialGeometry.snapToGrid);
    case 'rectangle':
      return renderRectangle(partialGeometry as Model.Types.Rectangle);
    case 'path':
      return renderPath(partialGeometry as Model.Types.Path);
    case 'circle':
      return renderCircle(partialGeometry as Model.Types.Circle);
  }
});
