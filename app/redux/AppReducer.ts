import { combineReducers } from 'redux';
import { gridReducer } from './grid/GridReducers';
import { Grid } from './grid/GridTypes';
import { layerTreeReducer } from './layertree/LayerTreeReducers';
import { LayerTree } from './layertree/LayerTreeTypes';
import { modelReducer } from './model/ModelReducers';
import { Model } from './model/ModelTypes';
import { Project } from './project/ProjectTypes';
import { projectReducer } from './project/ProjectReducers';
import { Navigation } from './navigation/NavigationTypes';
import { navigationReducer } from './navigation/NavigationReducers';
import { Asset } from './asset/AssetTypes';
import { assetReducer } from './asset/AssetReducers';

export interface ReduxState {
  model: Model.Types.State;
  grid: Grid.Types.State;
  layerTree: LayerTree.Types.State;
  project: Project.Types.State;
  navigation: Navigation.Types.State;
  assets: Asset.Types.State;
}

export const AppReducer = combineReducers<ReduxState>({
  model: modelReducer,
  grid: gridReducer,
  layerTree: layerTreeReducer,
  project: projectReducer,
  navigation: navigationReducer,
  assets: assetReducer,
});
