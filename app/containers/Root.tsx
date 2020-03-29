import * as React from 'react';
import { CanvasContainer } from './canvasContainer/CanvasContainer';
import { InfoPanel } from './infoPanel/InfoPanel';
import { Layers } from './layers/Layers';
import { MapperNavbar } from './navbar/Navbar';
import './Root.scss';

export class Root extends React.PureComponent<{}, {}> {
  public render() {
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
  }
}