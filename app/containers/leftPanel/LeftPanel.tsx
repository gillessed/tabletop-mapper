import * as React from 'react';
import { useDispatchers } from '../../DispatcherContextProvider';
import './LeftPanel.scss';
import { Layers } from './layers/Layers';
import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import { AssetPanel } from './assets/AssetPanel';

export function LeftPanel() {
  const dispatchers = useDispatchers();
  const [tab, setTab] = React.useState<'layers' | 'assets'>('layers');
  const containerClasses = classNames('left-panel-container', Classes.DARK);

  const setLayers = React.useCallback(() => setTab('layers'), [setTab]);
  const setAssets = React.useCallback(() => setTab('assets'), [setTab]);

  return (
    <div className={containerClasses}>
      <div className='left-panel-header unselectable title'>
        <Button
          minimal
          text='Layers'
          icon={IconNames.LAYERS}
          active={tab === 'layers'}
          large
          onClick={setLayers}
        />
        <Button
          minimal
          text='Assets'
          icon={IconNames.SOCIAL_MEDIA}
          active={tab === 'assets'}
          large
          onClick={setAssets}
        />
      </div>
      {tab === 'layers' && <Layers />}
      {tab === 'assets' && <AssetPanel/>}
    </div>
  );
}
