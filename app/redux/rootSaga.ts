import { listenerLoop, SagaListener } from './sagaListener';
import { fork, all } from 'redux-saga/effects';
import { initialize } from './initialize/sagas';
import { modelSaga } from './model/sagas';

export function* rootSaga(listeners: Set<SagaListener<any>>) {
    yield all([
        // Saga Listeners
        fork(listenerLoop, listeners),

        // App Sagas
        fork(initialize),
        fork(modelSaga),
    ]);
}