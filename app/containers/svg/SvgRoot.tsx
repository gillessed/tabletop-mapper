import * as React from 'react';
import { useSelector } from 'react-redux';
import { AppContext, useDispatchers } from '../../AppContextProvider';
import { Vector, Transform } from '../../math/Vector';
import { Grid } from '../../redux/grid/GridTypes';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { addCoordinateToPartialGeometry } from '../../redux/model/PartialGeometry';
import { generateRandomString } from '../../utils/randomId';
import { Features } from './features/Features';
import { GridLines } from './grid/Gridlines';
import { PartialGeometry } from './partialGeometry/PartialGeometry';

type MouseMode = Grid.Types.MouseMode;
const MouseMode = Grid.Types.MouseMode;

export namespace SvgRoot {
  export interface Props {
    width: number;
    height: number;
  }
}

const InitialScale = 50;
const ZoomConstant = 1.05;
const MaxScale = 400;
const MinScale = 2;

export const SvgRoot = React.memo(function SvgRoot({
  width,
  height,
}: SvgRoot.Props) {
  const dispatchers = useDispatchers();
  React.useEffect(() => {
    const initialVector = new Vector(
      width / (2 * InitialScale),
      height / (2 * InitialScale)
    );
    dispatchers.grid.setTransform(new Transform(initialVector, InitialScale));
  }, [dispatchers]);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const partialGeometry = useSelector(Grid.Selectors.getPartialGeometry);
  const transform = useSelector(Grid.Selectors.getTransform);
  const currentLayer = useSelector(LayerTree.Selectors.getCurrentLayer);

  const onMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    dispatchers.grid.setMousePosition(new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
    switch (mouseMode) {
      case MouseMode.None:
        dispatchers.grid.setMouseMode(MouseMode.Drag);
        break;
      case MouseMode.DrawPoint:
      case MouseMode.DrawRectangle:
      case MouseMode.DrawPath:
      case MouseMode.DrawCircle:
        const coordinate = transform.applyV(mousePosition).getCoordinate();
        const rounded = transform.applyV(mousePosition).round().getCoordinate();
        const { complete, geometry } = addCoordinateToPartialGeometry(partialGeometry, partialGeometry.snapToGrid ? rounded : coordinate);
        if (complete) {
          dispatchers.grid.setMouseMode(MouseMode.None);
          const featureId = generateRandomString();
          dispatchers.model.createFeature({
            id: featureId,
            name: 'New ' + Model.Types.Geometries[geometry.type].name,
            layerId: currentLayer,
            geometry: geometry as Model.Types.Geometry,
          });
          dispatchers.layerTree.expandNode(currentLayer);
          dispatchers.layerTree.selectNode(featureId);
          dispatchers.grid.updatePartialGeometry(undefined);
        } else {
          dispatchers.grid.updatePartialGeometry(geometry);
        }
        break;
    }
  }, [dispatchers, mouseMode, mousePosition, partialGeometry, mouseMode, transform, currentLayer]);

  const onMouseUp = React.useCallback(() => {
    if (mouseMode === MouseMode.Drag) {
      dispatchers.grid.setMouseMode(MouseMode.None);
    }
  }, [dispatchers, mouseMode]);

  const onMouseMove = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    if (mouseMode !== MouseMode.None) {
      dispatchers.grid.setMousePosition(new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
    }
    if (mouseMode == MouseMode.Drag && mousePosition) {
      const newTranslation = newMousePosition
        .subtract(mousePosition)
        .scalarMultiply(1 / transform.scale)
        .add(transform.translation);
      dispatchers.grid.setTransform(transform.setTranslation(newTranslation));
    }
  }, [dispatchers, mousePosition, mouseMode, transform]);

  const onWheel = React.useCallback((e : React.WheelEvent<SVGElement>) => {
    if ((transform.scale === MinScale && e.nativeEvent.deltaY > 0) ||
      (transform.scale === MaxScale && e.nativeEvent.deltaY < 0)) {
      return;
    }
    const mousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    let newScale = transform.scale * Math.pow(ZoomConstant, -Math.sign(e.nativeEvent.deltaY));
    if (newScale > MaxScale) {
      newScale = MaxScale;
    } else if (newScale < MinScale) {
      newScale = MinScale;
    }
    const newTranslation = transform.translation
      .subtract(mousePosition.scalarMultiply(1 / transform.scale))
      .add(mousePosition.scalarMultiply(1 / newScale));
    dispatchers.grid.setTransform(transform.setTranslation(newTranslation).setScale(newScale));
  }, [dispatchers, transform]);

  return (
    <svg
      className='app-canvas'
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
    >
      <rect x={0} y={0} width={width} height={height} fill='#E1E8ED' />
      <g transform={transform.toSvg()}>
        <PartialGeometry />
        <Features />
        <GridLines transform={transform} width={width} height={height} />
      </g>
    </svg>
  );

});
