import * as React from 'react';
import './ProjectDialog.scss';
import { NonIdealState, Classes, Button, Icon, Colors, Tooltip, PopoverInteractionKind } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { NewMapForm } from './NewMapForm';
import { ProjectList } from './ProjectList';
import { useSelector } from 'react-redux';
import { Project } from '../../redux/project/ProjectTypes';
import { useDispatchers } from '../../DispatcherContextProvider';
import { isAsyncLoaded } from '../../redux/utils/async';

function CloseButton() {
  const dispatchers = useDispatchers();
  const onClick = React.useCallback(() => {
    dispatchers.navigation.setProjectDialogOpen(false);
  }, [dispatchers]);
  return (
    <Tooltip content='Close project browser'>
      <Icon
        className='close-icon'
        icon={IconNames.CROSS}
        iconSize={36}
        onClick={onClick}
      />
    </Tooltip>
  );
}

function QuitButton() {
  const dispatchers = useDispatchers();
  const onClick = React.useCallback(() => {
    dispatchers.project.quitApplication();
  }, [dispatchers]);
  return (
    <Tooltip content='Close Tabletop Mapper'>
      <Icon
        className='close-icon'
        icon={IconNames.LOG_OUT}
        iconSize={24}
        onClick={onClick}
      />
    </Tooltip>
  );
}

export function ProjectDialog() {
  const project = useSelector(Project.Selectors.get);
  return (
    <div className='project-dialog-container'>
      <div className='project-dialog'>
        <div className='dialog-header'>
          <Icon
            className='header-icon'
            color={Colors.LIGHT_GRAY1}
            icon={IconNames.MAP_CREATE}
            iconSize={24}
          />
          <h1 className='project-title title'>Tabletop Mapper</h1>
          <div className='right-align'>
            {isAsyncLoaded(project) && <CloseButton />}
            {project == null && <QuitButton />}
          </div>
        </div>
        <div className='dialog-body'>
          <NewMapForm />
          <div className='separator' />
          <ProjectList />
        </div>
      </div>
    </div>
  );
}
