import { Colors, Icon, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Project } from '../../redux/project/ProjectTypes';
import { isAsyncLoaded } from '../../redux/utils/async';
import { NewMapForm } from './NewMapForm';
import './ProjectDialog.scss';
import { ProjectList } from './ProjectList';
import { Dialog } from '../dialog/Dialog';
import { Navigation } from '../../redux/navigation/NavigationTypes';

export function ProjectDialog() {
  const { isProjectDialogOpen } = useSelector(Navigation.Selectors.get);
  const dispatchers = useDispatchers();
  const project = useSelector(Project.Selectors.get);
  const closeDialog = React.useCallback(() => {
    dispatchers.navigation.setProjectDialogOpen(false);
  }, [dispatchers]);
  const closeApp = React.useCallback(() => {
    dispatchers.project.quitApplication();
  }, [dispatchers]);
  const onClose = isAsyncLoaded(project) ? closeDialog : closeApp ;
  const closeIcon = isAsyncLoaded(project) ? IconNames.CROSS : IconNames.LOG_OUT;
  const content = (
    <>
      <NewMapForm />
      <div className='project-dialog-separator' />
      <ProjectList />
    </>
  )
  return (
    <Dialog
      isOpen={isProjectDialogOpen}
      icon={IconNames.MAP_CREATE}
      title='Tabletop Mapper'
      content={content}
      closeIcon={closeIcon}
      onClose={onClose}
    />
  );
}
