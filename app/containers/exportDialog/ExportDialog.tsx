import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Navigation } from '../../redux/navigation/NavigationTypes';
import { Dialog } from '../dialog/Dialog';
import { MapExportForm } from './MapExportForm';

export const ExportDialog = React.memo(function ExportDialog() {
  const isExportDialogOpen = useSelector(Navigation.Selectors.isExportDialogOpen);
  const dispatchers = useDispatchers();
  const closeDialog = React.useCallback(() => {
    dispatchers.navigation.setExportDialogOpen(false);
  }, [dispatchers]);
  const content = <MapExportForm/>;
  return (
    <Dialog
      isOpen={isExportDialogOpen}
      icon={IconNames.EXPORT}
      title='Export Map'
      content={content}
      closeIcon={IconNames.CROSS}
      onClose={closeDialog}
    />
  );
});
