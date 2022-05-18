import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Navigation } from '../../redux/navigation/NavigationTypes';
import { Dialog } from '../dialog/Dialog';
import { GridSettingsForm } from './GridSettingsForm';

export function GridDialog() {
  const isGridDialogOpen = useSelector(Navigation.Selectors.isGridDialogOpen);
  const dispatchers = useDispatchers();
  const closeDialog = React.useCallback(() => {
    dispatchers.navigation.setGridDialogOpen(false);
  }, [dispatchers]);
  const content = <GridSettingsForm/>;
  return (
    <Dialog
      isOpen={isGridDialogOpen}
      icon={IconNames.GRID}
      title='Grid Settings'
      content={content}
      closeIcon={IconNames.CROSS}
      onClose={closeDialog}
    />
  );
}
