import * as React from 'react';
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useDispatchers } from '../../DispatcherContextProvider';

export function NavbarMainMenu() {
  const dispatchers = useDispatchers();
  const onClickMapBrowser = React.useCallback(() => {
    dispatchers.navigation.setProjectDialogOpen(true);
  }, [dispatchers]);
  const onClickSave = React.useCallback(() => {
    dispatchers.project.saveProject();
  }, [dispatchers]);
  const onOpenAssetManager = React.useCallback(() => {
    dispatchers.navigation.setCurrentView('AssetManager');
  }, [dispatchers]);
  const onExport = React.useCallback(() => {
    dispatchers.navigation.setExportDialogOpen(true);
  }, [dispatchers]);
  return (
    <Menu>
      <MenuItem text='Map Browser' icon={IconNames.FOLDER_OPEN} onClick={onClickMapBrowser} label="Ctrl+O" />
      <MenuItem text='Save Map' icon={IconNames.FLOPPY_DISK} onClick={onClickSave} label="Ctrl+S" />
      <MenuDivider />
      <MenuItem text='Open Asset Manager' icon={IconNames.MEDIA} onClick={onOpenAssetManager} label="Ctrl+M" />
      <MenuDivider />
      <MenuItem text='Export Map' icon={IconNames.EXPORT} onClick={onExport} label="Ctrl+E" />
      <MenuDivider />
      <MenuItem text='Exit' icon={IconNames.LOG_OUT} />
    </Menu>
  );
}
