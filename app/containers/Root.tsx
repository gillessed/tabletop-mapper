import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from '../redux/navigation/NavigationTypes';
import { ProjectContainer } from './ProjectContainer';
import { ProjectDialog } from './projectDialog/ProjectDialog';
import './Root.scss';
import { MapperNavbar } from './navbar/Navbar';
import { AssetManager } from './assetManager/AssetManager';
import { useDispatchers } from '../DispatcherContextProvider';
import { GridDialog } from './gridDialog/GridDialog';
import { Grid } from '../redux/grid/GridTypes';
import { ExportDialog } from './exportDialog/ExportDialog';

export const Root = function Root() {
  const dispatchers = useDispatchers();
  const { currentView } = useSelector(Navigation.Selectors.get);
  const currentDragginAsset = useSelector(Grid.Selectors.getAssetDropId)
  const onMouseUp = React.useCallback(() => {
    if (currentDragginAsset != null) {
      dispatchers.grid.stopDraggingAsset();
    }
  }, [dispatchers]);
  let appView: React.ReactNode | undefined;
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
    <div className='container root-container' onMouseUp={onMouseUp}>
      {appView}
      <ProjectDialog />
      <GridDialog />
      <ExportDialog />
    </div>
  );
};
