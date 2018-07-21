import * as React from 'react';
import { Navbar, Alignment, Button } from '@blueprintjs/core';

export class MapperNavbar extends React.Component<{}, {}> {
    public render() {
        return (
            <Navbar className='bp3-dark'>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Button minimal icon='cog'/>
                </Navbar.Group>
            </Navbar>
        );
    }
}