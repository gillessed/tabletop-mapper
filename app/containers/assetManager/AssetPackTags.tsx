import { Button, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Asset } from '../../redux/asset/AssetTypes';
import { useBooleanState } from '../../utils/hook';
import './AssetPackTags.scss';
import { AssetTagSelect } from './AssetTagSelect';

export interface AssetPackTagProps {
  assetPack: Asset.Types.AssetPack;
}

export const AssetPackTags = React.memo(function AssetPackTags({
  assetPack,
}: AssetPackTagProps) {
  const tagIndex = useSelector(Asset.Selectors.getTagIndex);
  const { state: editing, setFalse: setEditingFalse, setTrue: setEditingTrue } = useBooleanState(false);
  const tags = React.useMemo(() => assetPack.tagIds.map((tagId) => tagIndex.byId[tagId]), [assetPack.tagIds, tagIndex]);
  let content = null;
  if (!editing) {
    if (tags.length === 0) {
      content = (
        <div className='empty-tag-view'>
          This asset pack has no tags.
          <Button className='add-tag-button' intent={Intent.SUCCESS} text='Add Tags' icon={IconNames.TAG} onClick={setEditingTrue} />
        </div>
      );
    } else {
      content = (
        <div className='tag-list-container'>
          <div className='tag-list'>
            {tags.map((tag) => (<Tag
              large
              intent={Intent.PRIMARY}
              key={tag.id}
            >{tag.name}</Tag>))}
          </div>
          <Button className='add-tag-button' intent={Intent.SUCCESS} text='Edit Tags' icon={IconNames.TAG} onClick={setEditingTrue} />
        </div>
      );
    }
  } else {
    content = (
      <div className='tag-list-container'>
        <AssetTagSelect assetPack={assetPack} />
          <Button className='add-tag-button' intent={Intent.SUCCESS} text='Confirm' icon={IconNames.CONFIRM} onClick={setEditingFalse} />
      </div>
    );
  }
  return (
    <div className='asset-pack-tags'>
      {content}
    </div>
  )
});
