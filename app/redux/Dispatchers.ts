import { Store } from 'redux';
import { Grid } from './grid/GridTypes';
import { LayerTree } from './layertree/LayerTreeTypes';
import { Model } from './model/ModelTypes';
import { ReduxState } from './AppReducer';
import { createDispatcher, TypedDispatcher } from './utils/typedDispatcher';
import { useContext } from 'react';

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
