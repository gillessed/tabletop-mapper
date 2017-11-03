import { listenerLoop, SagaListener } from './sagaListener';
import { fork } from 'redux-saga/effects';
import { initialize } from './initialize/sagas';
import { modelSaga } from './model/sagas';
import { importSaga } from './import/sagas';
import { tagSaga } from './tag/sagas';
import { searchSaga } from './search/sagas';
import { galleryCacheSaga } from './galleryCache/sagas';

export function* rootSaga(listeners: Set<SagaListener<any>>) {
  yield [
    // Saga Listeners
    fork(listenerLoop, listeners),

    // App Sagas
    fork(initialize),
    fork(modelSaga),
    fork(importSaga),
    fork(tagSaga),
    fork(searchSaga),
    fork(galleryCacheSaga),
  ];
}