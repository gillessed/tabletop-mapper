import { ReduxState } from "../AppReducer";
import { Async } from "../utils/async";
import { Identifiable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Project {
  export function serialize(project: Types.Project): Types.SerializedProject {
    return {
      id: project.id,
      name: project.name,
      appVersion: project.appVersion,
      dateCreated: project.dateCreated,
      lastSaved: project.lastSaved,
      archived: project.archived,
    }
  }

  export namespace Types {

    export type State = Async<Project>;

    export interface SerializedProject extends Identifiable {
      appVersion: string;
      dateCreated: number;
      lastSaved: number;
      archived: boolean;
    }

    export interface Project extends SerializedProject {
      requiresSave: boolean;
    }
  }

  export namespace Payloads {}

  export const DispatchActions = {
    setProject: createActionWrapper<Async<Project.Types.Project>>('project::setProject'),
    createProject: createActionWrapper<string>('project::createProject'),
    openProject: createActionWrapper<string>('project::openProject'),
    saveProject: createActionWrapper<void>('project::saveProject'),
    saveAndQuit: createActionWrapper<void>('project::saveAndQuit'),
    quitApplication: createActionWrapper<void>('project::quitApplication'),
    setRequiresSave: createActionWrapper<boolean>('project::setRequiresSave'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.project;
  }
}
