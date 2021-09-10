import { Spinner } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Project } from '../redux/project/ProjectTypes';
import { isAsyncLoading, isAsyncNotLoaded } from '../redux/utils/async';
import { CanvasContainer } from './canvasContainer/CanvasContainer';
import { InfoPanel } from './infoPanel/InfoPanel';
import { LeftPanel } from './leftPanel/LeftPanel';
import { MapperNavbar } from './navbar/Navbar';
import './Root.scss';

export const ProjectContainer = function Root() {
  const project = useSelector(Project.Selectors.get);
  if (isAsyncNotLoaded(project)) {
    return null;
  } else if (isAsyncLoading(project)) {
    return <Spinner />;
  } else {
    return (
      <>
        <MapperNavbar />
        <div className='app-container'>
          <LeftPanel />
          <CanvasContainer />
          <InfoPanel />
        </div>
      </>
    );
  }
};
