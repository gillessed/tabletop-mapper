import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Transform, Vector } from '../../math/Vector';
import { Grid } from '../../redux/grid/GridTypes';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { DefaultSvgStyle } from '../../redux/model/DefaultStyles';
import { getHoveredFeatures } from '../../redux/model/FeatureIntersection';
import { Model } from '../../redux/model/ModelTypes';
import { addCoordinateToPartialGeometry } from '../../redux/model/PartialGeometry';
import { MouseButtons } from '../../utils/mouse';
import { generateRandomString } from '../../utils/randomId';
import { FeatureDragShadows } from './features/FeatureDragShadows';
import { FeatureOutlines } from './features/FeatureOutlines';
import { FeaturePartialGeometries } from './features/FeaturePartialGeometries';
import { Features } from './features/Features';
import { GridLines } from './grid/GridLines';
import { getFeatureTranslation } from '../../redux/model/FeatureTranslation';
import { getHighestFeatureId } from '../../redux/model/ModelTree';

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
  const features = useSelector(Model.Selectors.getFeatures);
  const styles = useSelector(Model.Selectors.getStyles);
  const layers = useSelector(Model.Selectors.getLayers);
  const selectedFeatureIds = useSelector(LayerTree.Selectors.getSelectedNodes);
  const mouseDragOrigin = useSelector(Grid.Selectors.getMouseDragOrigin);

  const onLeftMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    const coordinate = transform.applyV(newMousePosition).getCoordinate();
    switch (mouseMode) {
      case MouseMode.None:
        const hoveredFeatureIds: string[] = getHoveredFeatures(
          features,
          styles,
          coordinate,
          transform,
        );
        const hoveringSelectedFeature = selectedFeatureIds.find((id) => hoveredFeatureIds.indexOf(id) >= 0);
        if (!hoveringSelectedFeature) {
          if (hoveredFeatureIds.length >= 1) {
            const highestFeatureId = getHighestFeatureId(features, layers, hoveredFeatureIds);
            dispatchers.layerTree.selectNodes([highestFeatureId]);
          } else {
            dispatchers.layerTree.selectNodes([]);
          }
        }
        dispatchers.grid.setMouseDragOrigin(newMousePosition);
        dispatchers.grid.setMouseMode(MouseMode.DragFeatures);
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
            styleId: DefaultSvgStyle.id,
          });
          dispatchers.layerTree.expandNode(currentLayer);
          dispatchers.layerTree.selectNodes([featureId]);
          dispatchers.grid.updatePartialGeometry(undefined);
        } else {
          dispatchers.grid.updatePartialGeometry(geometry);
        }
        break;
    }
  }, [dispatchers, mouseMode, partialGeometry, mouseMode, transform, currentLayer, features, selectedFeatureIds, styles]);

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
      case MouseMode.Drag:
        dispatchers.grid.setMouseMode(MouseMode.None);
        break;
      case MouseMode.DragFeatures:
        const selectedFeatures = selectedFeatureIds.map((id) => features.byId[id]);
        const translation = getFeatureTranslation(
          mousePosition,
          mouseDragOrigin,
          transform,
          selectedFeatures,
        );
        dispatchers.grid.setMouseDragOrigin(undefined);
        dispatchers.grid.setMouseMode(MouseMode.None);
        dispatchers.model.translateFeatures({
          featureIds: selectedFeatureIds,
          translation,
        });
        break;
    }
  }, [dispatchers, mouseMode, features, mousePosition, mouseDragOrigin]);

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
        <GridLines transform={transform} width={width} height={height} />
        <FeaturePartialGeometries />
        <FeatureOutlines />
        <FeatureDragShadows />
      </g>
    </svg>
  );

});
