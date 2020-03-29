import { combineReducers } from 'redux';
import { modelReducer } from './model/ModelReducers';
import { gridReducer } from './grid/GridReducers';
import { Model } from './model/ModelTypes';
import { Grid } from './grid/GridTypes';
import { LayerTree } from './layertree/LayerTreeTypes';
import { layerTreeReducer } from './layertree/LayerTreeReducers';

export interface ReduxState {
    model: Model.Types.State;
    grid: Grid.Types.State;
    layerTree: LayerTree.Types.State;
}

export const rootReducer = combineReducers<ReduxState>({
    model: modelReducer,
    grid: gridReducer,
    layerTree: layerTreeReducer,
});