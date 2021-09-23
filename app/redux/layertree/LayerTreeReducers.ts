import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { LayerTree } from './LayerTreeTypes';
import { Model } from '../model/ModelTypes';
import { arrayEquals } from '../../utils/array';
import { ModelSet } from '../model/ModelReducers';

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

const setSelectNodesReducers = (state: LayerTree.Types.State, objectIds: string[]): LayerTree.Types.State => {
  if (arrayEquals(state.selectedNodes, objectIds)) {
    return state;
  }
  return {
    ...state,
    selectedNodes: objectIds,
  };
}

const clearSelectedNodesReducer = (state: LayerTree.Types.State): LayerTree.Types.State => setSelectNodesReducers(state, []);

const setModelReducer = (): LayerTree.Types.State => {
  return {
    expandedNodes: {
      [Model.RootLayerId]: true,
    },
    selectedNodes: [],
  };
}

export const layerTreeReducer: Reducer<LayerTree.Types.State> = newTypedReducer<LayerTree.Types.State>()
  .handlePayload(LayerTree.Actions.setNodesExpanded.type, setNodesExpandedReducer)
  .handlePayload(LayerTree.Actions.collapseNode.type, collapseNodeReducer)
  .handlePayload(LayerTree.Actions.setSelectedNodes.type, setSelectNodesReducers)
  .handlePayload(LayerTree.Actions.clearSelectedNodes.type, clearSelectedNodesReducer)
  .handlePayload(ModelSet.type, setModelReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();

