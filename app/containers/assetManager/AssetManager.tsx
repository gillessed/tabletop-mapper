import { Classes, ControlGroup, NonIdealState, InputGroup, Button, Tooltip, Intent } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';
import classNames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Asset } from '../../redux/asset/AssetTypes';
import './AssetManager.scss';
import { AssetEnumControl } from './AssetEnumControl';
import { useDispatchers } from '../../DispatcherContextProvider';
import { etn } from '../../etn';
import { ImageExtensions } from '../../utils/filer';
import { AssetGrid } from './AssetGrid';
import { AssetPackHeader } from './AssetPackHeader';

export type AssetView = 'grid' | 'list';
const AssetViewItems: { [key: string]: AssetEnumControl.Item<AssetView> } = {
  ['grid']: {
    id: 'grid',
    name: 'Grid',
    icon: IconNames.GRID_VIEW,
  },
  ['list']: {
    id: 'list',
    name: 'List',
    icon: IconNames.LIST,
  },
}

export type AssetOrder = 'name-asc' | 'name-desc';
const AssetOrderItems: { [key: string]: AssetEnumControl.Item<AssetOrder> } = {
  ['name-asc']: {
    id: 'name-asc',
    name: 'Name',
    icon: IconNames.SORT_DESC,
  },
  ['name-desc']: {
    id: 'name-desc',
    name: 'Name',
    icon: IconNames.SORT_ASC,
  },
}

export const NoPack = 'No Pack';

export interface AssetManagerState {
  view: 'by-pack' | 'by-tag' | 'pack';
  viewingItem: string | undefined;
}

export function AssetManager() {
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  const dispatchers = useDispatchers();
  const [assetManagerState, setAssetManagerState] = React.useState<AssetManagerState>({
    view: 'by-pack',
    viewingItem: undefined,
  });
  const [assetOrder, setAssetOrder] = React.useState<AssetOrder>('name-asc');
  const [assetView, setAssetView] = React.useState<AssetView>('grid');
  const [assetFilter, setAssetFilter] = React.useState<string>('');
  const onChangeAssetFilter = React.useCallback((e: React.FormEvent) => {
    setAssetFilter((e.target as HTMLInputElement).value);
  }, [setAssetFilter]);
  const onImport = React.useCallback(() => {
    etn().dialog.showOpenDialog({
      message: 'Import assets',
      buttonLabel: 'Import',
      filters: [
        { name: 'Images', extensions: ImageExtensions },
      ],
      properties: ['openDirectory', 'openFile', 'multiSelections'],
    }).then(({ canceled, filePaths }) => {
      if (!canceled && filePaths.length > 0) {
        dispatchers.assets.importAssets(filePaths);
      }
    });
  }, [dispatchers]);
  const assetItems = React.useMemo(() => {
    let allItems: Asset.Types.AssetItem[] = [];
    if (assetManagerState.view === 'by-pack') {
      const assetItems: { [name: string]: Asset.Types.AssetPack } = {};
      for (const assetId of assetIndex.all) {
        const asset = assetIndex.byId[assetId];
        const packName = asset.packName ?? '';
        if (assetItems[packName] == null) {
          assetItems[packName] = { assets: [], name: packName };
        }
        assetItems[packName].assets.push(asset);
      }
      for (const key of Object.keys(assetItems)) {
        allItems.push(assetItems[key]);
      }
    } else if (assetManagerState.view === 'by-tag') {
      // TODO (gcole)
    } else if (assetManagerState.view === 'pack') {
      const packName = assetManagerState.viewingItem;
      if (packName != null && packName.length !== 0) {
        for (const assetId of assetIndex.all) {
          const asset = assetIndex.byId[assetId];
          if (asset.packName === packName) {
            allItems.push(asset);
          }
        }
      }
    }
    allItems.sort((a1, a2) => {
      return a1.name.localeCompare(a2.name);
    });
    return allItems;
  }, [assetManagerState, assetOrder, assetFilter, assetIndex]);

  const classes = classNames('asset-manager', Classes.DARK);
  const hasAssets = assetIndex.all.length > 0;
  const foundAssets = assetItems.length > 0;
  console.log(hasAssets, foundAssets, assetView === 'grid');
  return (
    <div className={classes}>
      <div className='asset-manager-content'>
        <div className='title asset-manager-title'>Assets</div>
        <ControlGroup className='asset-control-group' fill>
          <AssetEnumControl<AssetView>
            state={assetView}
            setState={setAssetView}
            items={AssetViewItems}
          />
          <AssetEnumControl<AssetOrder>
            state={assetOrder}
            setState={setAssetOrder}
            items={AssetOrderItems}
          />
          <InputGroup
            value={assetFilter}
            placeholder='Search assets...'
            leftIcon={IconNames.SEARCH}
            onChange={onChangeAssetFilter}
            fill
          />
          <Tooltip
            content='Tabletop Mapper will import all image files within the selected folder.'
            hoverOpenDelay={1000}
          >
            <Button
              text='Import'
              icon={IconNames.CUBE_ADD}
              intent={Intent.PRIMARY}
              onClick={onImport}
            />
          </Tooltip>
        </ControlGroup>
        {!hasAssets && <NonIdealState
          icon={IconNames.CUBE_ADD}
          className='no-assets-state'
          description='You have not added any assets yet. Click import to add new assets to Tabletop Mapper.'
        />}
        {hasAssets && !foundAssets && <NonIdealState
          icon={IconNames.SEARCH}
          className='no-matching-assets-state'
          description='No assets were found.'
        />}
        {hasAssets && foundAssets && assetManagerState.view === 'pack' && <AssetPackHeader assetPackName={assetManagerState.viewingItem} />}
        {hasAssets && foundAssets && assetView === 'grid' && <AssetGrid
          assets={assetItems}
          setAssetManagerState={setAssetManagerState}
        />}
      </div>
    </div>
  );
}
