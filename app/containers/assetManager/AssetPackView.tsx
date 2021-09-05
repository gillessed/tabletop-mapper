import { Button, ControlGroup, EditableText, InputGroup, Intent, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Asset } from '../../redux/asset/AssetTypes';
import { AssetList } from './assetList/AssetList';
import './AssetPackView.scss';

export const NoPack = 'No Pack';

export namespace AssetPackView {
  export interface Props {
    assetPackId: string;
  }
}

export const AssetPackView = React.memo(({
  assetPackId
}: AssetPackView.Props) => {
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  const assetPackIndex = useSelector(Asset.Selectors.getAssetPackIndex);
  const dispatchers = useDispatchers();
  const assetPack = React.useMemo(() => assetPackIndex.byId[assetPackId], [assetPackIndex, assetPackId]);
  const [filter, setFilter] = React.useState<string>('');
  const lowerCaseFilter = filter.toLocaleLowerCase();
  const filteredAssetIds = React.useMemo(() => {
    return assetPack.assetIds
      .map((id) => assetIndex.byId[id])
      .filter((asset) => filter === '' || asset.name.toLocaleLowerCase().indexOf(lowerCaseFilter) >= 0)
      .map((assetPack) => assetPack.id);
  }, [assetPack, lowerCaseFilter, assetPack]);
  const onChangeAssetFilter = React.useCallback((e: React.FormEvent) => {
    setFilter((e.target as HTMLInputElement).value);
  }, [setFilter]);

  const [editTitleValue, setEditTitleValue] = React.useState(assetPack.name);
  const handleSaveAssetPackTitle = React.useCallback((newTitle) => {
    dispatchers.assets.setAssetPackName({
      id: assetPack.id,
      name: newTitle,
    });
  }, [assetPack.id, dispatchers]);
  return (
    <>
      <EditableText
        className='title asset-pack-view-title'
        value={editTitleValue}
        onChange={setEditTitleValue}
        onConfirm={handleSaveAssetPackTitle}
      />
      
      <ControlGroup className='asset-control-group' fill>
        <InputGroup
          value={filter}
          placeholder='Filter assets...'
          leftIcon={IconNames.SEARCH}
          onChange={onChangeAssetFilter}
          fill
        />
        <Tooltip
          content={`Tabletop Mapper will import all image files within the selected folder and add them to ${assetPack.name}`}
          hoverOpenDelay={1000}
        >
          <Button
            text='Import'
            icon={IconNames.CUBE_ADD}
            intent={Intent.PRIMARY}
          />
        </Tooltip>
      </ControlGroup>
      <AssetList assetIds={filteredAssetIds} />
    </>
  );
});
