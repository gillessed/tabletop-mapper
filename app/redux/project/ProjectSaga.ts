import { all, put, select, takeEvery, call } from "redux-saga/effects";
import { SagaContext } from "../AppSaga";
import { Model } from "../model/ModelTypes";
import { TypedAction, createPlaceholderAction } from "../utils/typedAction";
import { Project } from "./ProjectTypes";
import { generateRandomString } from "../../utils/randomId";
import { Navigation } from "../navigation/NavigationTypes";
import { getProjectFile, getProjectDataFile, AppConfig } from "../../config/AppConfig";
import { createEmptyModel } from "../model/ModelReducers";
import { asyncLoading, asyncLoaded, isAsyncLoaded } from "../utils/async";
import { etn } from "../../etn";
import { Toaster, Classes } from "@blueprintjs/core";

export function* projectSaga(context: SagaContext) {
  yield all([
    takeEvery(Project.Actions.createProject.type, createProjectSaga, context),
    takeEvery(Project.Actions.openProject.type, openProjectSaga, context),
    takeEvery(Project.Actions.saveProject.type, saveProjectSaga, context),
    takeEvery(Project.Actions.quitApplication.type, quitApplicationSaga, context),
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

  yield put(Model.Actions.setModel.create(projectModel));
  yield put(Project.Actions.setProject.create(asyncLoaded(project)));
}

function* saveProjectSaga(context: SagaContext) {
  const { appConfig, appToaster } = context;
  const asyncProject: ReturnType<typeof Project.Selectors.get> = yield select(Project.Selectors.get);
  const model = yield select(Model.Selectors.get);
  if (!isAsyncLoaded(asyncProject)) {
    return;
  }
  const project: Project.Types.Project = { 
    ...asyncProject.value,
    appVersion: appConfig.appVersion,
    lastSaved: Date.now(),
  };
  yield call(saveProjectHelper, context, project, model);
  appToaster.show({
    className: Classes.DARK,
    message: `Saved ${project.name}`,
  });
  yield put(Project.Actions.setProject.create(asyncLoaded(project)));
}

function* saveProjectHelper(
  context: SagaContext,
  project: Project.Types.Project,
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
  }
}

function* quitApplicationSaga(context: SagaContext) {
  // TODO: (gcole) check if there are unsaved changes
  etn().app.quit();
}
