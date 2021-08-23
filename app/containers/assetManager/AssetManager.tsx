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
  const assetPackIndex = useSelector(Asset.Selectors.getAssetPackIndex);
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
      for (const assetPackId of assetPackIndex.all) {
        const assetPack = assetPackIndex.byId[assetPackId];
        allItems.push(assetPack);
      }
    } else if (assetManagerState.view === 'by-tag') {
      // TODO (gcole)
    } else if (assetManagerState.view === 'pack') {
      const packId = assetManagerState.viewingItem;
      const assetPack = assetPackIndex.byId[packId];
      if (assetPack != null) {
        for (const assetId of assetPack.assetIds) {
          const asset = assetIndex.byId[assetId];
            allItems.push(asset);
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
