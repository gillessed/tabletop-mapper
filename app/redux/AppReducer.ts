import { combineReducers } from 'redux';
import { gridReducer } from './grid/GridReducers';
import { Grid } from './grid/GridTypes';
import { layerTreeReducer } from './layertree/LayerTreeReducers';
import { LayerTree } from './layertree/LayerTreeTypes';
import { modelReducer } from './model/ModelReducers';
import { Model } from './model/ModelTypes';

export interface ReduxState {
  model: Model.Types.State;
  grid: Grid.Types.State;
  layerTree: LayerTree.Types.State;
}

export const AppReducer = combineReducers<ReduxState>({
  model: modelReducer,
  grid: gridReducer,
  layerTree: layerTreeReducer,
});
