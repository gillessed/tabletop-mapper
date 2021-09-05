import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Asset } from '../../redux/asset/AssetTypes';
import './AssetManager.scss';
import { AssetPackView } from './AssetPackView';
import { AssetSearch } from './AssetSearch';

export function AssetManager() {
  const dispatchers = useDispatchers();
  const assetViewState = useSelector(Asset.Selectors.getViewState);

  const classes = classNames('asset-manager', Classes.DARK);

  const backButtonText = assetViewState.type === 'search' ? 'Return to map' : 'View all packs';
  const handleBackClick = React.useCallback(() => {
    if (assetViewState.type === 'search') {
      dispatchers.navigation.setCurrentView('Project');
    } else {
      dispatchers.assets.setViewState({ type: 'search' });
    }
  }, [assetViewState]);

  return (
    <div className={classes}>
      <div className='asset-manager-content'>
        <Button
          minimal
          large
          className="asset-manager-back-button"
          icon={IconNames.ARROW_LEFT}
          text={backButtonText}
          onClick={handleBackClick}
        />
        {assetViewState.type === 'search' && <AssetSearch />}
        {assetViewState.type === 'pack' && assetViewState.item != null && <AssetPackView assetPackId={assetViewState.item} />}
      </div>
    </div>
  );
}
