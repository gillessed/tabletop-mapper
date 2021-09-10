import { all, put, select, takeEvery, call } from "redux-saga/effects";
import { Model } from "../model/ModelTypes";
import { SagaContext } from "../AppSaga";
import { Indexable } from "../utils/indexable";
import { TypedAction } from "../utils/typedAction";
import { LayerTree } from "./LayerTreeTypes";

export function* layerTreeSaga(context: SagaContext) {
  yield all([
    takeEvery(LayerTree.Actions.expandNodes.type, expandNodesHandler),
  ]);
}

function* expandNodesHandler(action: TypedAction<string[]>) {
  for (const nodeId of action.payload) {
    yield call(expandNodeSaga, nodeId);
  }
}

function* expandNodeSaga(nodeId: string) {
  const layers: ReturnType<typeof Model.Selectors.getLayers> = yield select(Model.Selectors.getLayers);
  const features: ReturnType<typeof Model.Selectors.getFeatures> = yield select(Model.Selectors.getFeatures);
  const layer = layers.byId[nodeId] ?? layers.byId[features.byId[nodeId].layerId];
  const ids: string[] = [layer.id];
  let node = layers.byId[layer.id];
  while (node.parent !== null) {
    node = layers.byId[node.parent];
    ids.push(node.id);
  }
  yield put(LayerTree.Actions.setNodesExpanded.create(ids));
}

