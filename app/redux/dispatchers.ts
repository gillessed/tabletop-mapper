import { Store } from 'redux';
import { ReduxState } from './rootReducer';
import { createDispatcher, TypedDispatcher } from './utils/typedDispatcher';
import { Model } from './model/types';
import { Grid } from './grid/types';
import { LayerTree } from './layertree/types';

export interface Dispatchers {
    model: TypedDispatcher<typeof Model.DispatchActions>;
    grid: TypedDispatcher<typeof Grid.DispatchActions>;
    layerTree: TypedDispatcher<typeof LayerTree.DispatchActions>;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
    return {
        model: createDispatcher(store, Model.DispatchActions),
        grid: createDispatcher(store, Grid.DispatchActions),
        layerTree: createDispatcher(store, LayerTree.DispatchActions),
    };
};