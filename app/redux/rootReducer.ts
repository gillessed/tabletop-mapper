import { combineReducers } from 'redux';
import { modelReducer } from './model/reducers';
import { gridReducer } from './grid/reducers';
import { Model } from './model/types';
import { Grid } from './grid/types';
import { LayerTree } from './layertree/types';
import { layerTreeReducer } from './layertree/reducers';

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