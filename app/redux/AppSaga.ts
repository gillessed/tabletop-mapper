import { all, fork } from 'redux-saga/effects';
import { initialize } from './initialize/InitializationSaga';
import { layerTreeSaga } from './layertree/LayerTreeSagas';
import { modelSaga } from './model/ModelSagas';
import { ListenerLoop, SagaListener } from './SagaListener';

export interface SagaContext {

}

export function* appSaga(context: SagaContext, listeners: Set<SagaListener<any>>) {
  yield all([
    // Saga Listeners
    fork(ListenerLoop, listeners),

    // App Sagas
    fork(initialize),
    fork(modelSaga, context),
    fork(layerTreeSaga, context),
  ]);
}
