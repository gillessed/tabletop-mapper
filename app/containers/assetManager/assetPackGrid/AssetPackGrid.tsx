import { NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Asset } from '../../../redux/asset/AssetTypes';
import { range } from '../../../utils/array';
import './AssetPackGrid.scss';
import { AssetPackGridItem } from './AssetPackGridItem';

export namespace AssetPackGrid {
  export interface Props {
    filter: string;
  }
}

const makeGridFiller = (index: number) => {
  return <div key={index} className='asset-grid-filler' />;
}
const Filler = range(8).map((index) => makeGridFiller(index));

export const AssetPackGrid = React.memo(function AssetGrid({
  filter,
}: AssetPackGrid.Props) {
  const assetPackIndex = useSelector(Asset.Selectors.getAssetPackIndex);
  const lowerCaseFilter = filter.toLocaleLowerCase();
  const assets = React.useMemo(() => {
    let allItems: Asset.Types.AssetPack[] = [];
    for (const assetPackId of assetPackIndex.all) {
      const assetPack = assetPackIndex.byId[assetPackId];
      if (lowerCaseFilter.length === 0 || assetPack.name.toLocaleLowerCase().indexOf(lowerCaseFilter) >= 0) {
        allItems.push(assetPack);
      }
    }
    allItems.sort((a1, a2) => {
      return a1.name.localeCompare(a2.name);
    });
    return allItems;
  }, [lowerCaseFilter, assetPackIndex]);

  const hasAssetPacks = assetPackIndex.all.length > 0;
  const foundAssets = assets.length > 0;

  return (
    <div className='asset-pack-grid'>
      {!hasAssetPacks && <NonIdealState
        icon={IconNames.CUBE_ADD}
        className='no-assets-state'
        description='You have not added any asset packs yet. Click import to add new asset packs to Tabletop Mapper.'
      />}
      {hasAssetPacks && !foundAssets && <NonIdealState
        icon={IconNames.SEARCH}
        className='no-matching-assets-state'
        description='No assets were found.'
      />}
      {hasAssetPacks && foundAssets && <>
        {assets.map((assetItem) => {
          return (
            <AssetPackGridItem
              key={assetItem.name}
              assetPack={assetItem}
            />
          );
        })}
        {Filler}
      </>
      }
    </div>
  );
});
