import { ReduxState } from "../AppReducer";
import { Async } from "../utils/async";
import { Identifiable } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Project {
  export namespace Types {

    export type State = Async<Project>;

    export interface Project extends Identifiable {
      appVersion: string;
      dateCreated: number;
      lastSaved: number;
      archived: boolean;
    }
  }

  export namespace Payloads {}

  export const DispatchActions = {
    setProject: createActionWrapper<Async<Project.Types.Project>>('project::setProject'),
    createProject: createActionWrapper<string>('project::createProject'),
    openProject: createActionWrapper<string>('project::openProject'),
    saveProject: createActionWrapper<void>('project::saveProject'),
    quitApplication: createActionWrapper<void>('project::quitApplication'),
  }

  export const Actions = {
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.project;
  }
}
