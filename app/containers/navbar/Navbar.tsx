import { Alignment, Button, Classes, Navbar, Popover, PopoverInteractionKind, PopoverPosition } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import './Navbar.scss';
import { NavbarMainMenu } from './NavbarMainMenu';

export function MapperNavbar() {
  return (
    <Navbar className={Classes.DARK}>
      <Navbar.Group align={Alignment.LEFT}>
        <div className='menu-spacer' />
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Popover interactionKind={PopoverInteractionKind.CLICK} position={PopoverPosition.BOTTOM}>
          <Button minimal icon={IconNames.MENU} />
          <NavbarMainMenu />
        </Popover>
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.GRID} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.COG} />
      </Navbar.Group>
    </Navbar>
  );
}
