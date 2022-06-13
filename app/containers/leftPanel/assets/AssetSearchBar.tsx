import { Button, Icon, Intent, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { IItemRendererProps, MultiSelect } from '@blueprintjs/select';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Asset } from '../../../redux/asset/AssetTypes';
import { SearchKey } from './SearchKey';
import "./AssetSearchBar.scss";

export interface AssetSearchBarProps {
  searchKeys: SearchKey[];
  setSearchKeys: (searchKeys: SearchKey[]) => void;
}

const EmptyQuery = '__empty_query__';
const SearchSelect = MultiSelect.ofType<SearchKey>();
const TagProps = {
  intent: Intent.PRIMARY,
};

export const AssetSearchBar = React.memo(function AssetTagSelect({
  searchKeys,
  setSearchKeys,
}: AssetSearchBarProps) {
  const tagIndex = useSelector(Asset.Selectors.getTagIndex);
  const allTagKeys: SearchKey[] = React.useMemo(() => tagIndex.all.map((tagId) => ({ query: tagIndex.byId[tagId].name, type: 'tag', tagId })), [tagIndex]);

  const searchKeyListPredicate = React.useCallback((query: string, items: SearchKey[]): SearchKey[] => {
    const tagList = items.filter((key) => key.query.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) >= 0).slice(0, 20);
    return tagList;
  }, []);
  const renderNewItem = React.useCallback((query: string, active: boolean, handleClick: any) => {
    return (
      <MenuItem
        active={active}
        icon={IconNames.ADD}
        onClick={handleClick}
        text={`Search for keyword "${query}"`}
        shouldDismissPopover={false}
      />
    );
  }, []);
  const renderItem = React.useCallback((searchKey: SearchKey, { modifiers, handleClick }: IItemRendererProps) => {
    const icon = searchKeys.indexOf(searchKey) >= 0 ? IconNames.TICK : IconNames.BLANK;
    return (
      <MenuItem
        active={modifiers.active}
        icon={icon}
        key={searchKey.query}
        onClick={handleClick}
        text={searchKey.query}
        shouldDismissPopover={false}
      />
    );
  }, [searchKeys]);
  const renderSearchKey = React.useCallback((key: SearchKey) => {
    return (
      <>
        {key.type === 'tag' && <Icon className='asset-search-bar-tag-icon' icon={IconNames.TAG} size={12} />}
        {key.query}
      </>
    );
  }, []);
  const onSelectSearchKey = React.useCallback((item: SearchKey) => {
    const newSearchKeys = [...searchKeys];
    const itemIndex = searchKeys.indexOf(item);
    if (itemIndex < 0) {
      newSearchKeys.push(item);
    } else {
      newSearchKeys.splice(itemIndex, 1);
    }
    setSearchKeys(newSearchKeys);
  }, [searchKeys]);
  const createNewSearchKey = React.useCallback((query: string): SearchKey => {
    return { query, type: 'keyword' };
  }, []);
  const removeSearchKey = React.useCallback((_: React.ReactNode, index: number) => {
    const newSearchKeys = [...searchKeys];
    newSearchKeys.splice(index, 1);
    setSearchKeys(newSearchKeys);
  }, [setSearchKeys]);
  const clearSearchKeys = React.useCallback(() => setSearchKeys([]), [setSearchKeys]);
  return (
    <SearchSelect
      fill
      resetOnSelect
      items={allTagKeys}
      selectedItems={searchKeys}
      createNewItemFromQuery={createNewSearchKey}
      createNewItemRenderer={renderNewItem}
      createNewItemPosition='first'
      itemListPredicate={searchKeyListPredicate}
      itemRenderer={renderItem}
      tagRenderer={renderSearchKey}
      onItemSelect={onSelectSearchKey}
      tagInputProps={{
        onRemove: removeSearchKey,
        rightElement: <Button icon={IconNames.CROSS} minimal onClick={clearSearchKeys} large />,
        tagProps: TagProps,
      }}
      placeholder='Filter assets...'
    />
  );
});
