import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { LayerTree } from './LayerTreeTypes';
import { Model } from '../model/ModelTypes';

const INITIAL_STATE: LayerTree.Types.State = {
  expandedNodes: {
    [Model.ROOT_LAYER]: true,
  },
  selectedNode: Model.ROOT_LAYER,
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

const selectNodeReducer = (state: LayerTree.Types.State, layerId: string) => {
  return {
    ...state,
    selectedNode: layerId,
  };
}

export const layerTreeReducer: Reducer<LayerTree.Types.State> = newTypedReducer<LayerTree.Types.State>()
  .handlePayload(LayerTree.Actions.setNodesExpanded.type, setNodesExpandedReducer)
  .handlePayload(LayerTree.Actions.collapseNode.type, collapseNodeReducer)
  .handlePayload(LayerTree.Actions.selectNode.type, selectNodeReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();

