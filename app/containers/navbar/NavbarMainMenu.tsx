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
  return (
    <Menu>
      <MenuItem text='Map Browser' icon={IconNames.FOLDER_OPEN} onClick={onClickMapBrowser} />
      <MenuItem text='Save Map' icon={IconNames.FLOPPY_DISK} onClick={onClickSave} />
      <MenuDivider />
      <MenuItem text='Open Asset Manager' icon={IconNames.MEDIA} onClick={onOpenAssetManager} label="Ctrl+A"/>
      <MenuDivider />
      <MenuItem text='Exit' icon={IconNames.LOG_OUT} />
    </Menu>
  );
}
