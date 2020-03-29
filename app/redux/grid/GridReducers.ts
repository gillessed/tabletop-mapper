import { Reducer } from 'redux';
import { Transform, Vector } from '../../math/Vector';
import { newTypedReducer } from '../utils/typedReducer';
import { Grid } from './GridTypes';

const INITIAL_STATE: Grid.Types.State = {
  mouseMode: Grid.Types.MouseMode.NONE,
  transform: new Transform(new Vector(1, 1), 1),
};

const gridStateReducer = (state: Grid.Types.State, payload: Partial<Grid.Types.State>) => {
  return {
    ...state,
    ...payload,
  };
}

export const gridReducer: Reducer<Grid.Types.State> = newTypedReducer<Grid.Types.State>()
  .handlePayload(Grid.Actions.updateGridState.type, gridStateReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();
