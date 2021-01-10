import * as React from 'react';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Project } from '../../redux/project/ProjectTypes';
import './ProjectListEntry.scss';
import { getHumanReadableTimeLength } from '../../utils/time';

export namespace ProjectListEntry {
  export interface Props {
    project: Project.Types.Project;
  }
}

export const ProjectListEntry = React.memo(function ProjectListEntry({
  project
}: ProjectListEntry.Props) {
  const dispatchers = useDispatchers();
  const time = new Date().getTime();
  const editTime = time - project.lastSaved;
  const onClick = React.useCallback(() => {
    dispatchers.project.openProject(project.id);
  }, [dispatchers]);
  return (
    <div className='project-list-entry' onClick={onClick}>
      <div className='title'>{project.name}</div>
      <div className='subtitle'>Last edited {getHumanReadableTimeLength(editTime)} ago</div>
    </div>
  );
});
