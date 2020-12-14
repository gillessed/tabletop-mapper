import * as React from 'react';
import { CanvasContainer } from './canvasContainer/CanvasContainer';
import { InfoPanel } from './infoPanel/InfoPanel';
import { Layers } from './layers/Layers';
import { MapperNavbar } from './navbar/Navbar';
import './Root.scss';

export const Root = React.memo(function Root() {
  return (
    <div className='container root-container'>
      <MapperNavbar />
      <div className='app-container'>
        <Layers />
        <CanvasContainer />
        <InfoPanel />
      </div>
    </div>
  );
});
