import * as React from 'react';
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export function NavbarMainMenu() {
  return (
    <Menu>
      <MenuItem text='New Map' icon={IconNames.NEW_LAYER} />
      <MenuItem text='Open Map' icon={IconNames.DOCUMENT_OPEN} />
      <MenuItem text='Save Map' icon={IconNames.FLOPPY_DISK}/>
      <MenuDivider />
      <MenuItem text='Open Asset Manager' icon={IconNames.MEDIA}/>
      <MenuDivider />
      <MenuItem text='Exit' icon={IconNames.LOG_OUT}/>
    </Menu>
  );
}
