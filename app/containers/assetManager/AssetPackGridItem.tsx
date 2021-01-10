import * as React from 'react';
import { Asset } from '../../redux/asset/AssetTypes';
import './AssetGridItem.scss';
import { AssetManagerState } from './AssetManager';
import { useAppConfig } from '../../AppConfigContextProvider';

export namespace AssetPackGridItem {
  export interface Props {
    assetPack: Asset.Types.AssetPack;
    setAssetManagerState: (state: AssetManagerState) => void;
  }
}

export const AssetPackGridItem = React.memo(function AssetPackGridItem({
  assetPack, setAssetManagerState
}: AssetPackGridItem.Props) {
  const appConfig = useAppConfig();
  const previews = assetPack.assets.slice(0, 9);
  const onClick = React.useCallback(() => {
    setAssetManagerState({
      view: 'pack',
      viewingItem: assetPack.name,
    })
  }, [assetPack, setAssetManagerState]);
  return (
    <div className='asset-pack-grid-item' onClick={onClick}>
      <div className='image-preview-container'>
        {previews.map((assetPreview) => {
          return (
            <img
              key={assetPreview.id}
              className='image-preview'
              src={appConfig.getAssetFileById(assetPreview.id, assetPreview.extension).fullPath}
            />
          );
        })}
      </div>
      <div className='title'>{assetPack.name}</div>
      <div className='subtitle'>{assetPack.assets.length} assets</div>
    </div>
  );
});
