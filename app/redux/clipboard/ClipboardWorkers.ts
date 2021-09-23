import { Store } from "redux";
import { Vector } from "../../math/Vector";
import { generateRandomString } from "../../utils/randomId";
import { ReduxState } from "../AppReducer";
import { LayerTree } from "../layertree/LayerTreeTypes";
import { getCoverSet, treeWalk } from "../model/ModelTree";
import { Model } from "../model/ModelTypes";
import { getBoundingBox } from "../model/ModelUtils";
import { StoreWorker0 } from "../utils/workers";
import { Clipboard } from "./ClipboardTypes";

export const TransformRatio = 0.2;

export const copySelectionWorker: StoreWorker0<void> = async (store: Store<ReduxState>) => {
  const state = store.getState();
  const selectedIds = LayerTree.Selectors.getSelectedNodes(state);
  if (selectedIds.length === 1 && selectedIds[0] === Model.RootLayerId || selectedIds.length === 0) {
    return;
  }
  store.dispatch(Clipboard.Actions.setItems.create(selectedIds));
}

export const pasteClipboardWorker: StoreWorker0<void> = async (store: Store<ReduxState>) => {
  const state = store.getState();
  const { items, pasteCount } = Clipboard.Selectors.get(state);
  const featureIndex = Model.Selectors.getFeatures(state);
  const layerIndex = Model.Selectors.getLayers(state);
  const coverSet = getCoverSet(items, featureIndex, layerIndex);

  const newIds = createCopiesOfNodes(store, coverSet);
  const newState = store.getState();
  const newFeatureIndex = Model.Selectors.getFeatures(newState);
  const newFeatureIds = newIds.filter((id) => newFeatureIndex.byId[id] != null);

  const geometriesToCopy: Model.Types.Geometry[] = [];
  for (const id of newFeatureIds) {
    const newFeature = newFeatureIndex.byId[id];
    geometriesToCopy.push(newFeature.geometry);
  }

  const { p1, p2 } = getBoundingBox(geometriesToCopy);
  const dx = Math.round((p2.x - p1.x) * TransformRatio * (pasteCount + 1));
  const dy = Math.round((p2.y - p1.y) * TransformRatio * (pasteCount + 1));
  const translation = new Vector(Math.max(pasteCount + 1, dx), Math.max(pasteCount + 1, dy));
  store.dispatch(Model.Actions.translateFeatures.create({
    featureIds: newFeatureIds,
    translation,
  }, { ignoreUndo: true }));
  store.dispatch(LayerTree.Actions.setSelectedNodes.create(newIds));
  store.dispatch(Clipboard.Actions.increasePasteCount.create());
}

const createCopiesOfNodes = (store: Store<ReduxState>, nodeIds: Iterable<string>): string[] => {
  const state = store.getState();
  const featureIndex = Model.Selectors.getFeatures(state);
  const layerIndex = Model.Selectors.getLayers(state);
  const newIds: string[] = [];

  let madeNewState = false

  for (const sourceId of nodeIds) {
    const rootParentLayerId = layerIndex.byId[sourceId]?.parent ?? featureIndex.byId[sourceId]?.layerId;
    const copiedIds = new Map<string, string>();
    treeWalk(
      featureIndex,
      layerIndex,
      {
        visitLayer: (layer) => {
          const newId = generateRandomString();
          copiedIds.set(layer.id, newId);
          const parentId = layer.id === sourceId ?
            rootParentLayerId :
            copiedIds.get(layer.parent);
          store.dispatch(Model.Actions.createLayer.create({
            layerId: newId,
            name: `Copy of ${layer.name}`,
            parentId,
          }, { ignoreUndo: madeNewState }));
          madeNewState = true;
          newIds.push(newId);
        },
        visitFeature: (feature) => {
          const parentId = feature.id === sourceId ?
            rootParentLayerId :
            copiedIds.get(feature.layerId);
          const newId = generateRandomString();
          const newFeature: Model.Types.Feature = {
            ...feature,
            id: newId,
            name: `Copy of ${feature.name}`,
            layerId: parentId,
          }
          store.dispatch(Model.Actions.createFeature.create(newFeature, { ignoreUndo: madeNewState }));
          madeNewState = true;
          newIds.push(newId);
        },
        startingNode: sourceId,
      },
    );
  }

  return newIds;
}
