import { Store } from "redux";
import { ReduxState } from "../AppReducer";
import { getAllDescendants } from "../model/ModelTree";
import { Model } from "../model/ModelTypes";
import { StoreWorker1 } from "../utils/workers";
import { LayerTree } from "./LayerTreeTypes";

export const selectAndExpandNodesWorker: StoreWorker1<void, string[]> = async (store: Store<ReduxState>, nodeIds: string[]) => {
  await expandNodesWorker(store, nodeIds);
  await selectNodesWorker(store, nodeIds);
}

export const expandNodesWorker: StoreWorker1<void, string[]> = async (store: Store<ReduxState>, nodeIds: string[]) => {
  const state = store.getState();
  const layerIndex = Model.Selectors.getLayers(state);
  const featureIndex = Model.Selectors.getFeatures(state);
  for (const id of nodeIds) {
    const layer = layerIndex.byId[id] ?? layerIndex.byId[featureIndex.byId[id].layerId];
    const parents: string[] = [layer.id];
    let node = layerIndex.byId[layer.id];
    while (node.parent !== null) {
      node = layerIndex.byId[node.parent];
      parents.push(node.id);
    }
    store.dispatch(LayerTree.Actions.setNodesExpanded.create(parents));
  }
}

export const selectNodesWorker: StoreWorker1<void, string[]> = async (store: Store<ReduxState>, nodeIds: string[]) => {
  const state = store.getState();
  const layerIndex = Model.Selectors.getLayers(state);
  const featureIndex = Model.Selectors.getFeatures(state);
  const allDescendants = getAllDescendants(nodeIds, featureIndex, layerIndex);
  store.dispatch(LayerTree.Actions.setSelectedNodes.create([...allDescendants]));
}
