import { all, fork } from "redux-saga/effects";
import { AppConfig } from "../config/AppConfig";
import { projectSaga } from "./project/ProjectSaga";
import { IToaster } from "@blueprintjs/core";
import { assetSaga } from "./asset/AssetSagas";

export interface SagaContext {
  appConfig: AppConfig;
  appToaster: IToaster;
}

export function* appSaga(context: SagaContext) {
  yield all([
    // App Sagas
    fork(projectSaga, context),
    fork(assetSaga, context),
  ]);
}
