import { SagaContext } from "../rootSaga";
import { takeEvery, all, select, put } from "redux-saga/effects";
import { LayerTree } from "./types";
import { TypedAction } from "../utils/typedAction";
import { Model } from "../model/types";
import { Indexable } from "../utils/indexable";

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