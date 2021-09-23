import { Transform, Vector, Coordinate } from '../../math/Vector';
import { Model } from '../model/ModelTypes';
import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Grid } from './GridTypes';

const INITIAL_STATE: Grid.Types.State = {
  mouseMode: Grid.Types.MouseMode.None,
  transform: new Transform(new Vector(1, 1), 1),
  mouseOnCanvas: false,
};

const setMousePositionReducer = (state: Grid.Types.State, mousePosition: Vector): Grid.Types.State => {
  return { ...state, mousePosition };
}

const setTransformReducer = (state: Grid.Types.State, transform: Transform): Grid.Types.State => {
  return { ...state, transform };
}

const setMouseModeReducer = (state: Grid.Types.State, mouseMode: Grid.Types.MouseMode): Grid.Types.State => {
  return { ...state, mouseMode };
}

const startDrawReducer = (state: Grid.Types.State, type: Model.Types.GeometryType): Grid.Types.State => {
  let mouseMode: Grid.Types.MouseMode;
  switch (type) {
    case 'path': mouseMode = Grid.Types.MouseMode.DrawPath; break;
    case 'rectangle': mouseMode = Grid.Types.MouseMode.DrawRectangle; break;
  }
  if (!mouseMode) {
    return state;
  }
  return {
    ...state,
    mouseMode,
    partialGeometry: {
      type,
      snapToGrid: true,
    },
  };
}

const updatePartialGeometryReducer = (
  state: Grid.Types.State,
  partialGeometry: Partial<Model.Types.Geometry>,
): Grid.Types.State => {
  return { ...state, partialGeometry };
}

const setMouseDragOriginReducer = (
  state: Grid.Types.State,
  mouseDragOrigin: Coordinate,
): Grid.Types.State => {
  return { ...state, mouseDragOrigin };
}

const startDraggingAssetReducer = (
  state: Grid.Types.State,
  assetId: string,
): Grid.Types.State => {
  return { ...state, draggingAsset: assetId, mouseMode: Grid.Types.MouseMode.DragAsset };
}

const stopDraggingAssetReducer = (
  state: Grid.Types.State,
): Grid.Types.State => {
  return { ...state, draggingAsset: undefined, mouseMode: Grid.Types.MouseMode.None };
}

const setMouseOnCanvasReducer = (
  state: Grid.Types.State,
  mouseOnCanvas: boolean,
): Grid.Types.State => {
  return { ...state, mouseOnCanvas };
}

const startResizeFeatureReducer = (
  state: Grid.Types.State,
  payload: Grid.Payloads.ResizeFeaturePayload,
): Grid.Types.State => {
  return {
    ...state,
    mouseMode: payload.geometryType === 'path' ? Grid.Types.MouseMode.ResizePath : Grid.Types.MouseMode.ResizeRectangle,
    resizeInfo: payload.info,
    resizedFeature: undefined,
  };
}

const setResizeFeatureReducer = (
  state: Grid.Types.State,
  resizedFeature: Model.Types.Feature,
): Grid.Types.State  => {
  return { ...state, resizedFeature };
}

const stopResizeFeatureReducer = (
  state: Grid.Types.State,
): Grid.Types.State => {
  return {
    ...state,
    mouseMode: Grid.Types.MouseMode.None,
    resizeInfo: undefined,
    resizedFeature: undefined,
  };
}

export const gridReducer: Reducer<Grid.Types.State> = newTypedReducer<Grid.Types.State>()
  .handlePayload(Grid.Actions.setMousePosition.type, setMousePositionReducer)
  .handlePayload(Grid.Actions.setTransform.type, setTransformReducer)
  .handlePayload(Grid.Actions.setMouseMode.type, setMouseModeReducer)
  .handlePayload(Grid.Actions.startDraw.type, startDrawReducer)
  .handlePayload(Grid.Actions.updatePartialGeometry.type, updatePartialGeometryReducer)
  .handlePayload(Grid.Actions.setMouseDragOrigin.type, setMouseDragOriginReducer)
  .handlePayload(Grid.Actions.startDraggingAsset.type, startDraggingAssetReducer)
  .handlePayload(Grid.Actions.stopDraggingAsset.type, stopDraggingAssetReducer)
  .handlePayload(Grid.Actions.setMouseOnCanvas.type, setMouseOnCanvasReducer)
  .handlePayload(Grid.Actions.startResizeFeature.type, startResizeFeatureReducer)
  .handlePayload(Grid.Actions.setResizedFeature.type, setResizeFeatureReducer)
  .handlePayload(Grid.Actions.stopResizeFeature.type, stopResizeFeatureReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();
