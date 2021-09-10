import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Project } from './ProjectTypes';
import { Async, isAsyncLoaded } from '../utils/async';
import { ipcInvoke } from '../../ipc/ipcInvoke';
import { Ipc } from '../../ipc/ipcCommands';

const INITIAL_STATE: Project.Types.State = null;

const setProjectReducer = (_: Project.Types.State, project: Async<Project.Types.Project>): Project.Types.State => {
  return project;
}

const setRequiresSaveReducer = (project: Project.Types.State, requiresSave: boolean): Project.Types.State => {
  if (!isAsyncLoaded(project)) {
    return project;
  }
  const newProject: Project.Types.Project = { ...project.value, requiresSave };
  ipcInvoke(Ipc.SetRequiresSave, requiresSave);
  return { value: newProject, loading: false };
}

export const projectReducer: Reducer<Project.Types.State> = newTypedReducer<Project.Types.State>()
  .handlePayload(Project.Actions.setProject.type, setProjectReducer)
  .handlePayload(Project.Actions.setRequiresSave.type, setRequiresSaveReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();

