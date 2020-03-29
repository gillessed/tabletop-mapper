import { listenerLoop, SagaListener } from './SagaListener';
import { fork, all } from 'redux-saga/effects';
import { initialize } from './initialize/InitializationSaga';
import { modelSaga } from './model/ModelSagas';
import { layerTreeSaga } from './layertree/LayerTreeSagas';

export interface SagaContext {

}

export function* rootSaga(context: SagaContext, listeners: Set<SagaListener<any>>) {
    yield all([
        // Saga Listeners
        fork(listenerLoop, listeners),

        // App Sagas
        fork(initialize),
        fork(modelSaga, context),
        fork(layerTreeSaga, context),
    ]);
}