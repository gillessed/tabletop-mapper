import { all, put, select, takeEvery } from "redux-saga/effects";
import { Model } from "../model/ModelTypes";
import { SagaContext } from "../RootSaga";
import { Indexable } from "../utils/indexable";
import { TypedAction } from "../utils/typedAction";
import { LayerTree } from "./LayerTreeTypes";

export function* layerTreeSaga(context: SagaContext) {
  yield all([
    takeEvery(LayerTree.Actions.expandNode.type, expandNodeWorker, context),
  ]);
}

function* expandNodeWorker(context: SagaContext, action: TypedAction<string>) {
  const layers: Indexable<Model.Types.Layer> = yield select(Model.Selectors.getLayers);
  const layerId = action.payload;
  const ids: string[] = [layerId];
  let node = layers.byId[layerId];
  while (node.parent !== null) {
    node = layers.byId[node.parent];
    ids.push(node.id);
  }
  yield put(LayerTree.Actions.setNodesExpanded.create(ids));
}