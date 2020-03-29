import { listenerLoop, SagaListener } from './sagaListener';
import { fork, all } from 'redux-saga/effects';
import { initialize } from './initialize/sagas';
import { modelSaga } from './model/sagas';
import { layerTreeSaga } from './layertree/sagas';

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