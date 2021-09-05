import * as React from 'react';
import { Asset } from '../../../redux/asset/AssetTypes';
import './AssetPackGridItem.scss';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../../DispatcherContextProvider';

export namespace AssetPackGridItem {
  export interface Props {
    assetPack: Asset.Types.AssetPack;
  }
}

export const AssetPackGridItem = React.memo(function AssetPackGridItem({
  assetPack
}: AssetPackGridItem.Props) {
  const dispatchers = useDispatchers();
  const appConfig = useAppConfig();
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  const previews = assetPack.assetIds.slice(0, 9).map((id) => {
    return assetIndex.byId[id];
  });
  const onClick = React.useCallback(() => {
    dispatchers.assets.setViewState({
      type: 'pack',
      item: assetPack.id,
    });
  }, [assetPack, dispatchers]);
  return (
    <div className='asset-pack-grid-item' onClick={onClick}>
      <div className='asset-pack-image-preview-container'>
        {previews.map((assetPreview) => {
          return (
            <img
              key={assetPreview.id}
              className='asset-pack-image-preview'
              src={appConfig.getAssetFileById(assetPreview.id, assetPreview.extension).fullPath}
            />
          );
        })}
      </div>
      <div className='asset-pack-title'>{assetPack.name}</div>
      <div className='asset-pack-subtitle'>{assetPack.assetIds.length} assets</div>
    </div>
  );
});
