import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from '../redux/navigation/NavigationTypes';
import { ProjectContainer } from './ProjectContainer';
import { ProjectDialog } from './projectDialog/ProjectDialog';
import './Root.scss';
import { MapperNavbar } from './navbar/Navbar';
import { AssetManager } from './assetManager/AssetManager';

export const Root = function Root() {
  const { currentView, isProjectDialogOpen } = useSelector(Navigation.Selectors.get);
  let appView = undefined;
  switch (currentView) {
    case "Blank":
      appView = <div className='blank-container' />
      break;
    case "Project":
      appView = <ProjectContainer />;
      break;
    case "AssetManager":
      appView = (
        <>
          <MapperNavbar />
          <AssetManager />
        </>
      )
      break;
  }
  return (
    <div className='container root-container'>
      {appView}
      {isProjectDialogOpen && <ProjectDialog />}
    </div>
  );
};
