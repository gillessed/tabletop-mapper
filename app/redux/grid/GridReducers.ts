import { Reducer } from 'redux';
import { Transform, Vector, Coordinate } from '../../math/Vector';
import { Model } from '../model/ModelTypes';
import { newTypedReducer } from '../utils/typedReducer';
import { Grid } from './GridTypes';

const INITIAL_STATE: Grid.Types.State = {
  mouseMode: Grid.Types.MouseMode.None,
  transform: new Transform(new Vector(1, 1), 1),
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
    case 'circle': mouseMode = Grid.Types.MouseMode.DrawCircle; break;
    case 'rectangle': mouseMode = Grid.Types.MouseMode.DrawRectangle; break;
    case 'point': mouseMode = Grid.Types.MouseMode.DrawPoint; break;
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

export const gridReducer: Reducer<Grid.Types.State> = newTypedReducer<Grid.Types.State>()
  .handlePayload(Grid.Actions.setMousePosition.type, setMousePositionReducer)
  .handlePayload(Grid.Actions.setTransform.type, setTransformReducer)
  .handlePayload(Grid.Actions.setMouseMode.type, setMouseModeReducer)
  .handlePayload(Grid.Actions.startDraw.type, startDrawReducer)
  .handlePayload(Grid.Actions.updatePartialGeometry.type, updatePartialGeometryReducer)
  .handlePayload(Grid.Actions.setMouseDragOrigin.type, setMouseDragOriginReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();
