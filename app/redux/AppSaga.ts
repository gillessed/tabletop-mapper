import { all, fork } from 'redux-saga/effects';
import { AppConfig } from '../config/AppConfig';
import { layerTreeSaga } from './layertree/LayerTreeSagas';
import { projectSaga } from './project/ProjectSaga';
import { ListenerLoop, SagaListener } from './SagaListener';
import { IToaster } from '@blueprintjs/core';
import { assetSaga } from './asset/AssetSagas';

export interface SagaContext {
  appConfig: AppConfig;
  appToaster: IToaster;
}

export function* appSaga(context: SagaContext, listeners: Set<SagaListener<any>>) {
  yield all([
    // Saga Listeners
    fork(ListenerLoop, listeners),

    // App Sagas
    fork(layerTreeSaga, context),
    fork(projectSaga, context),
    fork(assetSaga, context),
  ]);
}
