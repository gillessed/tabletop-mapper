import * as React from 'react';
import { useSelector } from 'react-redux';
import { Asset } from '../../../redux/asset/AssetTypes';
import './AssetList.scss';
import { AssetListItem } from './AssetListItem';

export namespace AssetList {
  export interface Props {
    assetIds: string[];
  }
}

export const AssetList = React.memo(({
  assetIds,
}: AssetList.Props) => {
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  return (
    <div className='asset-list'>
      {assetIds.map((assetId) => {
        const asset = assetIndex.byId[assetId]
        return (
          <AssetListItem
            key={assetId}
            asset={asset}
          />
        );
      })}
    </div>
  );
});
