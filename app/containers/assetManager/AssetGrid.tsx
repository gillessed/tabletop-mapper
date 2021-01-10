import * as React from 'react';
import { Asset } from '../../redux/asset/AssetTypes';
import { AssetManagerState } from './AssetManager';
import './AssetGrid.scss';
import { AssetGridItem } from './AssetGridItem';
import { AssetPackGridItem } from './AssetPackGridItem';
import { range } from '../../utils/array';

export namespace AssetGrid {
  export interface Props {
    assets: Asset.Types.AssetItem[];
    setAssetManagerState: (state: AssetManagerState) => void;
  }
}

function makeFiller(index: number) {
  return <div key={index} className='asset-grid-filler' />;
}

const Filler = range(8).map((index) => makeFiller(index));

export const AssetGrid = React.memo(function AssetGrid({
  assets,
  setAssetManagerState,
}: AssetGrid.Props) {
  return (
    <div className='asset-grid'>
      {assets.map((assetItem) => {
        if (Asset.Types.isAssetPack(assetItem)) {
          return (
            <AssetPackGridItem
              key={assetItem.name}
              assetPack={assetItem}
              setAssetManagerState={setAssetManagerState}
            />
          );
        } else {
          return (
            <AssetGridItem
              key={assetItem.name}
              asset={assetItem}
              setAssetManagerState={setAssetManagerState}
            />
          );
        }
      })}
      {Filler}
    </div>
  );
});
