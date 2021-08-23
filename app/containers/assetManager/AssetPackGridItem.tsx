import * as React from 'react';
import { Asset } from '../../redux/asset/AssetTypes';
import './AssetGridItem.scss';
import { AssetManagerState } from './AssetManager';
import { useAppConfig } from '../../AppConfigContextProvider';
import { useSelector } from 'react-redux';

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
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  const previews = assetPack.assetIds.slice(0, 9).map((id) => {
    return assetIndex.byId[id];
  });
  const onClick = React.useCallback(() => {
    setAssetManagerState({
      view: 'pack',
      viewingItem: assetPack.name,
    });
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
      <div className='subtitle'>{assetPack.assetIds.length} assets</div>
    </div>
  );
});
