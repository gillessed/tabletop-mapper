import { Alignment, Button, Classes, Icon, Navbar, Popover, PopoverInteractionKind, PopoverPosition } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import './Navbar.scss';
import { NavbarMainMenu } from './NavbarMainMenu';
import { useSelector } from 'react-redux';
import { Project } from '../../redux/project/ProjectTypes';
import { isAsyncLoaded } from '../../redux/utils/async';
import { NavbarEditMenu } from './NavbarEditMenu';
import { useDispatchers } from '../../DispatcherContextProvider';

export function MapperNavbar() {
  const project = useSelector(Project.Selectors.get);
  const dispatchers = useDispatchers();
  const openGridDialog = React.useCallback(() => {
    dispatchers.navigation.setGridDialogOpen(true);
  }, [dispatchers]);
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
        <Popover interactionKind={PopoverInteractionKind.CLICK} position={PopoverPosition.BOTTOM}>
          <Button minimal icon={IconNames.EDIT} />
          <NavbarEditMenu />
        </Popover>
        <Button minimal icon={IconNames.GRID} onClick={openGridDialog} />
        <Button minimal icon={IconNames.COG} />
        {isAsyncLoaded(project) &&
          <>
            <Navbar.Divider />
            <Navbar.Heading>
              <div className='navbar-title-container'>
                <div className='title navbar-title'>{project.value.name}</div>
                <div className='unsaved-icon-container'>
                  {project.value.requiresSave && <Icon
                    icon={IconNames.LIFESAVER}
                    iconSize={14}
                  />}
                </div>
              </div>
            </Navbar.Heading>
          </>
        }
      </Navbar.Group>
    </Navbar>
  );
}
