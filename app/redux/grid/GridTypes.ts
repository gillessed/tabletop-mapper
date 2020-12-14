import { Transform, Vector } from "../../math/Vector";
import { ReduxState } from "../AppReducer";
import { Model } from '../model/ModelTypes';
import { createActionWrapper } from "../utils/typedAction";

export namespace Grid {
  export namespace Types {
    export interface State {
      transform: Transform;
      mouseMode: MouseMode;
      partialGeometry?: Partial<Model.Types.Geometry>;
      mousePosition?: Vector;
    }

    export enum MouseMode {
      None,
      Drag,
      DrawPoint,
      DrawRectangle,
      DrawPath,
      DrawCircle,
    }
  }

  export namespace Payloads {
  }

  export const DispatchActions = {
    setMousePosition: createActionWrapper<Vector>('grid::setMousePosition'),
    setTransform: createActionWrapper<Transform>('grid::setTransform'),
    setMouseMode: createActionWrapper<Types.MouseMode>('grid::setMouseMode'),
    startDraw: createActionWrapper<Model.Types.GeometryType>('grid::startDraw'),
    updatePartialGeometry: createActionWrapper<Partial<Model.Types.Geometry>>('grid::updatePartialGeometry'),
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
  }
}
