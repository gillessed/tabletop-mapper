import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { LayerTree } from './LayerTreeTypes';
import { Model } from '../model/ModelTypes';

const INITIAL_STATE: LayerTree.Types.State = {
  expandedNodes: {
    [Model.RootLayerId]: true,
  },
  selectedNodes: [Model.RootLayerId],
};

const setNodesExpandedReducer = (state: LayerTree.Types.State, layerIds: string[]) => {
  let expandedNodes: { [key: string]: boolean } = { ...state.expandedNodes };
  for (const layerId of layerIds) {
    expandedNodes[layerId] = true;
  }
  return {
    ...state,
    expandedNodes,
  };
}

const collapseNodeReducer = (state: LayerTree.Types.State, layerId: string) => {
  return {
    ...state,
    expandedNodes: {
      ...state.expandedNodes,
      [layerId]: false,
    }
  };
}

const selectNodesReducers = (state: LayerTree.Types.State, layerIds: string[]): LayerTree.Types.State => {
  return {
    ...state,
    selectedNodes: layerIds,
  };
}

export const layerTreeReducer: Reducer<LayerTree.Types.State> = newTypedReducer<LayerTree.Types.State>()
  .handlePayload(LayerTree.Actions.setNodesExpanded.type, setNodesExpandedReducer)
  .handlePayload(LayerTree.Actions.collapseNode.type, collapseNodeReducer)
  .handlePayload(LayerTree.Actions.selectNodes.type, selectNodesReducers)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();

