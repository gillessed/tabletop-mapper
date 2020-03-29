import { Alignment, Button, Navbar } from '@blueprintjs/core';
import * as React from 'react';

export class MapperNavbar extends React.Component<{}, {}> {
  public render() {
    return (
      <Navbar className='bp3-dark'>
        <Navbar.Group align={Alignment.LEFT}>
          <div style={{ width: 300 }} />
        </Navbar.Group>
        <Navbar.Group align={Alignment.LEFT}>
          <Button minimal icon='menu' />
        </Navbar.Group>
        <Navbar.Group align={Alignment.LEFT}>
          <Button minimal icon='grid' />
        </Navbar.Group>
        <Navbar.Group align={Alignment.LEFT}>
          <Button minimal icon='cog' />
        </Navbar.Group>
      </Navbar>
    );
  }
}