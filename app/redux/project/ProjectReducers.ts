import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Project } from './ProjectTypes';
import { Async } from '../utils/async';

const INITIAL_STATE: Project.Types.State = null;

const setProjectReducer = (_: Project.Types.State, project: Async<Project.Types.Project>): Project.Types.State => {
  return project
}

export const projectReducer: Reducer<Project.Types.State> = newTypedReducer<Project.Types.State>()
  .handlePayload(Project.Actions.setProject.type, setProjectReducer)
  .handleDefault((state = INITIAL_STATE) => state)
  .build();

