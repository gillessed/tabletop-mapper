import * as React from 'react';
import { Asset } from '../../redux/asset/AssetTypes';
import './AssetGridItem.scss';
import { AssetManagerState } from './AssetManager';
import { useAppConfig } from '../../AppConfigContextProvider';

export namespace AssetGridItem {
  export interface Props {
    asset: Asset.Types.Asset;
    setAssetManagerState: (state: AssetManagerState) => void;
  }
}

export const AssetGridItem = React.memo(function AssetGridItem({
  asset, setAssetManagerState
}: AssetGridItem.Props) {
  const appConfig = useAppConfig();
  const file = appConfig.getAssetFileById(asset.id, asset.extension);
  return (
    <div className='asset-grid-item'>
      <div className='asset-image-container'>
        <img
          className='asset-image'
          src={file.fullPath}
        />
      </div>
      <div className='title'>{asset.name}</div>
    </div>
  );
});
