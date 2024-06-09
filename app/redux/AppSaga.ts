import { all, fork } from "redux-saga/effects";
import { AppConfig } from "../config/AppConfig";
import { projectSaga } from "./project/ProjectSaga";
import { Toaster } from "@blueprintjs/core";
import { assetSaga } from "./asset/AssetSagas";
import { FileCopier } from "../../filer/fileCopier";

export interface SagaContext {
  fileCopier: FileCopier;
  appConfig: AppConfig;
  appToaster: Toaster;
}

export function* appSaga(context: SagaContext) {
  yield all([
    // App Sagas
    fork(projectSaga, context),
    fork(assetSaga, context),
  ]);
}
