import { Alignment, Button, Classes, Navbar } from '@blueprintjs/core';
import * as React from 'react';
import { IconNames } from '@blueprintjs/icons';

export const MapperNavbar = React.memo(function MapperNavbar() {
  return (
    <Navbar className={Classes.DARK}>
      <Navbar.Group align={Alignment.LEFT}>
        <div style={{ width: 300 }} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.MENU} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.GRID} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.LEFT}>
        <Button minimal icon={IconNames.COG} />
      </Navbar.Group>
    </Navbar>
  );
});
