import { all, put, select, takeEvery, call } from "redux-saga/effects";
import { SagaContext } from "../AppSaga";
import { Model } from "../model/ModelTypes";
import { TypedAction, createPlaceholderAction } from "../utils/typedAction";
import { Project } from "./ProjectTypes";
import { generateRandomString } from "../../utils/randomId";
import { Navigation } from "../navigation/NavigationTypes";
import { getProjectFile, getProjectDataFile, AppConfig } from "../../config/AppConfig";
import { createEmptyModel, ModelSet } from "../model/ModelReducers";
import { asyncLoading, asyncLoaded, isAsyncLoaded } from "../utils/async";
import { Classes } from "@blueprintjs/core";
import { ipcInvoke } from "../../ipc/ipcInvoke";
import { Ipc } from "../../ipc/ipcCommands";

export function* projectSaga(context: SagaContext) {
  yield all([
    takeEvery(Project.Actions.createProject.type, createProjectSaga, context),
    takeEvery(Project.Actions.openProject.type, openProjectSaga, context),
    takeEvery(Project.Actions.saveProject.type, saveProjectSaga, context),
    takeEvery(Project.Actions.saveAndQuit.type, saveAndQuitProjectSaga, context),
    takeEvery(Project.Actions.quitApplication.type, quitApplicationSaga, context),

    // Project edits
    takeEvery(Model.Actions.createFeature.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.createLayer.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.reparentNodes.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.setFeatureGeometry.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.setFeatureName.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.setPathsClosed.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.setSnapToGrid.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.translateFeatures.type, setProjectRequiresSaveSaga),
    takeEvery(Model.Actions.setPathsClosed.type, setProjectRequiresSaveSaga),
  ]);
}

function* createProjectSaga(context: SagaContext, action: TypedAction<string>) {
  const { appConfig } = context;
  const now = Date.now();
  const newProject: Project.Types.Project = {
    id: generateRandomString(),
    appVersion: appConfig.appVersion,
    name: action.payload,
    dateCreated: now,
    lastSaved: now,
    archived: false,
    requiresSave: false,
  };
  yield call(saveProjectHelper, context, newProject, createEmptyModel());
  yield call(openProjectSaga, context, createPlaceholderAction(newProject.id));
}

function* openProjectSaga(context: SagaContext, action: TypedAction<string>) {
  const { appConfig } = context;
  const projectId = action.payload;
  yield put(Navigation.Actions.setProjectDialogOpen.create(false));
  yield put(Project.Actions.setProject.create(asyncLoading()));
  yield put(Navigation.Actions.setCurrentView.create('Project'));

  const projectFile = getProjectFile(appConfig, projectId);
  const rawProject: string = yield call(projectFile.readFile);
  const loadedProject: Project.Types.Project = JSON.parse(rawProject);
  const project = { ...loadedProject, lastSaved: Date.now() };
  yield call(saveProjectHelper, context, project);

  const projectDataFile = getProjectDataFile(appConfig, projectId);
  const rawModel: string = yield call(projectDataFile.readFile);
  const projectModel: Model.Types.State = JSON.parse(rawModel);

  yield put(ModelSet.create(projectModel));
  yield put(Project.Actions.setRequiresSave.create(false));
  yield put(Project.Actions.setProject.create(asyncLoaded(project)));
}

function* saveProjectSaga(context: SagaContext) {
  const { appConfig, appToaster } = context;
  const asyncProject: ReturnType<typeof Project.Selectors.get> = yield select(Project.Selectors.get);
  const model: ReturnType<typeof Model.Selectors.get> = yield select(Model.Selectors.get);
  if (!isAsyncLoaded(asyncProject)) {
    return;
  }
  const project: Project.Types.Project = { 
    ...asyncProject.value,
    appVersion: appConfig.appVersion,
    lastSaved: Date.now(),
    requiresSave: false,
  };
  const serializedProject = Project.serialize(project);
  yield call(saveProjectHelper, context, serializedProject, model);
  appToaster.show({
    className: Classes.DARK,
    message: `Saved ${project.name}`,
  });
  yield put(Project.Actions.setProject.create(asyncLoaded(project)));
}

function* saveAndQuitProjectSaga(context: SagaContext) {
  yield put(Project.Actions.setRequiresSave.create(false));
  yield call(saveProjectSaga, context);
  ipcInvoke(Ipc.Quit);
}

function* saveProjectHelper(
  context: SagaContext,
  project: Project.Types.SerializedProject,
  model?: Model.Types.State,
) {
  const { appConfig } = context;
  const projectFile = getProjectFile(appConfig, project.id);
  const rawProject = JSON.stringify(project);
  yield call(projectFile.writeFile, rawProject); 

  if (model != null) {
    const projectDataFile = getProjectDataFile(appConfig, project.id);
    const rawModel = JSON.stringify(model);
    yield call(projectDataFile.writeFile, rawModel);
    yield put(Project.Actions.setRequiresSave.create(false));
  }
}

function* quitApplicationSaga(context: SagaContext) {
  ipcInvoke(Ipc.Quit);
}

function* setProjectRequiresSaveSaga() {
  yield put(Project.Actions.setRequiresSave.create(true));
}
