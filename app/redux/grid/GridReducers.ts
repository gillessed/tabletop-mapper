import { expandRectangle } from '../../math/ExpandGeometry';
import { Transform, Vector, Coordinate } from '../../math/Vector';
import { modelReducer, ModelSet } from '../model/ModelReducers';
import { Model } from '../model/ModelTypes';
import { getBoundingBox } from '../model/ModelUtils';
import { visitGeometry } from '../model/ModelVisitors';
import { Project } from '../project/ProjectTypes';
import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Grid } from './GridTypes';

const INITIAL_STATE: Grid.Types.State = {
  mouseMode: Grid.Types.MouseMode.None,
  transformSet: false,
  transform: new Transform(new Vector(1, 1), 1),
  mouseOnCanvas: false,
};

const setMousePositionReducer = (state: Grid.Types.State, mousePosition: Vector): Grid.Types.State => {
  return { ...state, mousePosition };
}

const setTransformReducer = (state: Grid.Types.State, transform: Transform): Grid.Types.State => {
  return { ...state, transform, transformSet: true };
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
): Grid.Types.State => {
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

const unsetTransformReducer = (state: Grid.Types.State): Grid.Types.State => ({ ...state, transformSet: false });

const setInitialTransformReducer = (
  state: Grid.Types.State,
  payload: Model.Types.State,
): Grid.Types.State => {
  if (payload.features.all.length === 0) {
    return state;
  }
  const geometries: Model.Types.Geometry[] = [];
  for (const featureId of payload.features.all) {
    const feature = payload.features.byId[featureId];
    geometries.push(feature.geometry);
  }
  const boundingBox: Model.Types.Rectangle = getBoundingBox(geometries);
  const expanded = expandRectangle(boundingBox, 1);
  const midx = expanded.p1.x + (expanded.p2.x - expanded.p1.x) / 2;
  const midy = expanded.p1.y + (expanded.p2.y - expanded.p1.y) / 2;
  const transform = new Transform(new Vector(-midx, -midy), 30);
  return { ...state, transform };
}

const startResizeClipRegionReducer = (
  state: Grid.Types.State,
  resizeInfo: Grid.Types.ResizeInfo,
): Grid.Types.State => {
  return {
    ...state,
    clipRegionResizeInfo: resizeInfo,
  };
}

const editClipRegionReducer = (
  state: Grid.Types.State,
  featureId: string,
): Grid.Types.State => {
  return {
    ...state,
    editingFeatureClipRegion: featureId,
    resizedClipRegion: undefined,
  };
}

const stopResizeClipRegionReducer = (
  state: Grid.Types.State,
): Grid.Types.State => {
  return {
    ...state,
    mouseMode: Grid.Types.MouseMode.None,
    clipRegionResizeInfo: undefined,
  };
}

const setResizeClipRegionReducer = (
  state: Grid.Types.State,
  clipRegion: Model.Types.Rectangle,
): Grid.Types.State => {
  return {
    ...state,
    resizedClipRegion: clipRegion,
  }
}

const finishEditClipRegionReducer = (
  state: Grid.Types.State
): Grid.Types.State => {
  return {
    ...state,
    resizedClipRegion: undefined,
    editingFeatureClipRegion: undefined,
    clipRegionResizeInfo: undefined,
  }
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
  .handlePayload(Grid.Actions.editClipRegion.type, editClipRegionReducer)
  .handlePayload(Grid.Actions.startResizeClipRegion.type, startResizeClipRegionReducer)
  .handlePayload(Grid.Actions.setResizedClipRegion.type, setResizeClipRegionReducer)
  .handlePayload(Grid.Actions.stopResizeClipRegion.type, stopResizeClipRegionReducer)
  .handlePayload(Grid.Actions.finishEditClipRegion.type, finishEditClipRegionReducer)
  .handlePayload(Project.Actions.openProject.type, unsetTransformReducer)
  .handlePayload(ModelSet.type, setInitialTransformReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();
