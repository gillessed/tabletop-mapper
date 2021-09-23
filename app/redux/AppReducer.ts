import { combineReducers } from 'redux';
import { gridReducer } from './grid/GridReducers';
import { Grid } from './grid/GridTypes';
import { layerTreeReducer } from './layertree/LayerTreeReducers';
import { LayerTree } from './layertree/LayerTreeTypes';
import { modelReducer, undoableModelReducer } from './model/ModelReducers';
import { Model } from './model/ModelTypes';
import { Project } from './project/ProjectTypes';
import { projectReducer } from './project/ProjectReducers';
import { Navigation } from './navigation/NavigationTypes';
import { navigationReducer } from './navigation/NavigationReducers';
import { Asset } from './asset/AssetTypes';
import { assetReducer } from './asset/AssetReducers';
import { Undoable } from './undo/UndoState';
import { Clipboard } from './clipboard/ClipboardTypes';
import { clipboardReducer } from './clipboard/ClipboardReducers';

export interface ReduxState {
  model: Undoable<Model.Types.State>;
  grid: Grid.Types.State;
  layerTree: LayerTree.Types.State;
  project: Project.Types.State;
  navigation: Navigation.Types.State;
  assets: Asset.Types.State;
  clipboard: Clipboard.Types.State;
}

export const AppReducer = combineReducers<ReduxState>({
  model: undoableModelReducer,
  layerTree: layerTreeReducer,
  project: projectReducer,
  grid: gridReducer,
  navigation: navigationReducer,
  assets: assetReducer,
  clipboard: clipboardReducer,
});
