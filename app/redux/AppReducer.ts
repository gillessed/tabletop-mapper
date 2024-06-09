import { combineReducers } from "redux";
import { assetReducer } from "./asset/AssetReducers";
import { Asset } from "./asset/AssetTypes";
import { clipboardReducer } from "./clipboard/ClipboardReducers";
import { Clipboard } from "./clipboard/ClipboardTypes";
import { gridReducer } from "./grid/GridReducers";
import { Grid } from "./grid/GridTypes";
import { layerTreeReducer } from "./layertree/LayerTreeReducers";
import { LayerTree } from "./layertree/LayerTreeTypes";
import { undoableModelReducer } from "./model/ModelReducers";
import { Model } from "./model/ModelTypes";
import { navigationReducer } from "./navigation/NavigationReducers";
import { Navigation } from "./navigation/NavigationTypes";
import { projectReducer } from "./project/ProjectReducers";
import { Project } from "./project/ProjectTypes";
import { Undoable } from "./undo/UndoState";

export interface ReduxState {
  model: Undoable<Model.Types.State>;
  grid: Grid.Types.State;
  layerTree: LayerTree.Types.State;
  project: Project.Types.State;
  navigation: Navigation.Types.State;
  assets: Asset.Types.State;
  clipboard: Clipboard.Types.State;
}

export const AppReducer = combineReducers<any>({
  model: undoableModelReducer,
  layerTree: layerTreeReducer,
  project: projectReducer,
  grid: gridReducer,
  navigation: navigationReducer,
  assets: assetReducer,
  clipboard: clipboardReducer,
});
