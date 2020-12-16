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
import { FeatureOutlines } from './features/FeatureOutlines';
import { MouseButtons } from '../../utils/mouse';
import { Colors } from '@blueprintjs/core';
import { doesFeatureContain } from '../../redux/model/FeatureIntersection';

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
const SelectionPadding = 5;

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
  const features = useSelector(Model.Selectors.getFeatures);

  const onLeftMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    const coordinate = transform.applyV(newMousePosition).getCoordinate();
    switch (mouseMode) {
      case MouseMode.None:
        const hoveredFeatures: string[] = [];
        const padding = transform.applyScalar(SelectionPadding);
        for (const featureId of features.all) {
          const feature = features.byId[featureId];
          if (doesFeatureContain(feature, coordinate, padding)) {
            hoveredFeatures.push(featureId);
          }
        }
        dispatchers.layerTree.selectNodes(hoveredFeatures);
        break;
      case MouseMode.DrawPoint:
      case MouseMode.DrawRectangle:
      case MouseMode.DrawPath:
      case MouseMode.DrawCircle:
        const rounded = transform.applyV(newMousePosition).round().getCoordinate();
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
          dispatchers.layerTree.selectNodes([featureId]);
          dispatchers.grid.updatePartialGeometry(undefined);
        } else {
          dispatchers.grid.updatePartialGeometry(geometry);
        }
        break;
    }
  }, [dispatchers, mouseMode, partialGeometry, mouseMode, transform, currentLayer, features]);

  const onRightMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    switch (mouseMode) {
      case MouseMode.None:
        dispatchers.grid.setMouseMode(MouseMode.Drag);
        break;
    }
  }, [dispatchers]);

  const onMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    dispatchers.grid.setMousePosition(newMousePosition);
    if (e.button === MouseButtons.Left) {
      onLeftMouseDown(e);
    } else if (e.button === MouseButtons.Right) {
      onRightMouseDown(e);
    }
  }, [dispatchers, onLeftMouseDown, onRightMouseDown]);

  const onMouseUp = React.useCallback(() => {
    switch (mouseMode) {
      case MouseMode.None:
        
      case MouseMode.Drag:
        dispatchers.grid.setMouseMode(MouseMode.None);
        break;
    }
    if (mouseMode === MouseMode.Drag) {
    }
  }, [dispatchers, mouseMode, features]);

  const onMouseMove = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    switch(mouseMode) {
      case MouseMode.Drag:
        if (mousePosition) {
          const newTranslation = newMousePosition
            .subtract(mousePosition)
            .scalarMultiply(1 / transform.scale)
            .add(transform.translation);
          dispatchers.grid.setTransform(transform.setTranslation(newTranslation));
        }
        break;
    }
    dispatchers.grid.setMousePosition(new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
  }, [dispatchers, mousePosition, mouseMode, transform]);

  const onWheel = React.useCallback((e: React.WheelEvent<SVGElement>) => {
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
      <rect x={0} y={0} width={width} height={height} fill={Colors.LIGHT_GRAY5} />
      <g transform={transform.toSvg()}>
        <Features />
        <FeatureOutlines />
        <PartialGeometry />
        <GridLines transform={transform} width={width} height={height} />
      </g>
    </svg>
  );

});
