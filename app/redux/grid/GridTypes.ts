import { Transform, Vector, Coordinate } from "../../math/Vector";
import { ReduxState } from "../AppReducer";
import { Model } from '../model/ModelTypes';
import { createActionWrapper } from "../utils/typedAction";
import { RectangleResizeMode } from "../model/ControlPoints";

export namespace Grid {
  export namespace Types {
  
    export interface ResizeInfo {
      featureId: string;
      cursor: string;
      rectMode?: RectangleResizeMode;
      pathIndex?: number; 
    }

    export interface State {
      transform: Transform;
      mouseMode: MouseMode;
      partialGeometry?: Partial<Model.Types.Geometry>;
      mousePosition?: Vector;
      mouseDragOrigin?: Coordinate;
      draggingAsset?: string;
      mouseOnCanvas: boolean;
      resizeInfo?: ResizeInfo;
    }

    export enum MouseMode {
      None,
      Drag,
      DrawRectangle,
      DrawPath,
      DragFeatures,
      DragAsset,
      ResizeRectangle,
      ResizePath,
      DragSelectionInTree,
    }
  }

  export namespace Payloads {
    export interface ResizeFeaturePayload {
      geometryType: 'rectangle' | 'path';
      info: Types.ResizeInfo;
    }
  }

  export const DispatchActions = {
    setMousePosition: createActionWrapper<Vector>('grid::setMousePosition'),
    setTransform: createActionWrapper<Transform>('grid::setTransform'),
    setMouseMode: createActionWrapper<Types.MouseMode>('grid::setMouseMode'),
    startDraw: createActionWrapper<Model.Types.GeometryType>('grid::startDraw'),
    updatePartialGeometry: createActionWrapper<Partial<Model.Types.Geometry>>('grid::updatePartialGeometry'),
    setMouseDragOrigin: createActionWrapper<Coordinate | undefined>('grid::setMouseDragOrigin'),
    startDraggingAsset: createActionWrapper<string>('grid::startDraggingAsset'),
    stopDraggingAsset: createActionWrapper<void>('grid::stopDraggingAsset'),
    setMouseOnCanvas: createActionWrapper<boolean>('grid::setMouseOnCanvas'),
    startResizeFeature: createActionWrapper<Payloads.ResizeFeaturePayload>('grid::startResizeFeature'),
    stopResizeFeature: createActionWrapper<void>('grid::stopResizeFeature'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.grid;
    export const getPartialGeometry = (state: ReduxState) => get(state).partialGeometry;
    export const getMousePosition = (state: ReduxState) => get(state).mousePosition;
    export const getTransform = (state: ReduxState) => get(state).transform;
    export const getMouseMode = (state: ReduxState) => get(state).mouseMode;
    export const getMouseDragOrigin = (state: ReduxState) => get(state).mouseDragOrigin;
    export const getAssetDropId = (state: ReduxState) => get(state).draggingAsset;
    export const getMouseOnCanvas = (state: ReduxState) => get(state).mouseOnCanvas;
    export const getResizeInfo = (state: ReduxState) => get(state).resizeInfo;
  }
}
