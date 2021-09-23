import { Store } from 'redux';
import { Grid } from './grid/GridTypes';
import { LayerTree } from './layertree/LayerTreeTypes';
import { Model } from './model/ModelTypes';
import { ReduxState } from './AppReducer';
import { createDispatcher, TypedDispatcher } from './utils/typedDispatcher';
import { useContext } from 'react';
import { Project } from './project/ProjectTypes';
import { Navigation } from './navigation/NavigationTypes';
import { Asset } from './asset/AssetTypes';
import { Clipboard } from './clipboard/ClipboardTypes';

export interface Dispatchers {
  model: TypedDispatcher<typeof Model.DispatchActions>;
  grid: TypedDispatcher<typeof Grid.DispatchActions>;
  layerTree: TypedDispatcher<typeof LayerTree.DispatchActions>;
  project: TypedDispatcher<typeof Project.DispatchActions>;
  navigation: TypedDispatcher<typeof Navigation.DispatchActions>;
  assets: TypedDispatcher<typeof Asset.DispatchActions>;
  clipboard: TypedDispatcher<typeof Clipboard.DispatchActions>;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
  return {
    model: createDispatcher(store, Model.DispatchActions),
    grid: createDispatcher(store, Grid.DispatchActions),
    layerTree: createDispatcher(store, LayerTree.DispatchActions),
    project: createDispatcher(store, Project.DispatchActions),
    navigation: createDispatcher(store, Navigation.DispatchActions),
    assets: createDispatcher(store, Asset.DispatchActions),
    clipboard: createDispatcher(store, Clipboard.DispatchActions),
  };
};
