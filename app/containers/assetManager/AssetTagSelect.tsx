import { Intent, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { useSelector } from "react-redux";
import { useDispatchers } from "../../DispatcherContextProvider";
import { Asset } from "../../redux/asset/AssetTypes";
import { generateRandomString } from "../../utils/randomId";
import "./AssetTagSelect.scss";

export interface AssetTagSelectProps {
  assetPack: Asset.Types.AssetPack;
}

const EmptyQuery = "__empty_query__";
const TagSelect = MultiSelect.ofType<Asset.Types.Tag>();
const TagProps = {
  large: true,
  intent: Intent.PRIMARY,
};

export const AssetTagSelect = React.memo(function AssetTagSelect({
  assetPack,
}: AssetTagSelectProps) {
  const dispatchers = useDispatchers();
  const tagIndex = useSelector(Asset.Selectors.getTagIndex);
  const allTags: Asset.Types.Tag[] = React.useMemo(
    () => tagIndex.all.map((tagId) => tagIndex.byId[tagId]),
    [tagIndex]
  );
  const selectedTags: Asset.Types.Tag[] = React.useMemo(
    () => assetPack.tagIds.map((tagId) => tagIndex.byId[tagId]),
    [assetPack, tagIndex]
  );
  const tagListPredicate = React.useCallback(
    (query: string, items: Asset.Types.Tag[]): Asset.Types.Tag[] => {
      if (query.length === 0) {
        return [
          {
            id: EmptyQuery,
            name: "Search tags...",
          },
        ];
      } else {
        const tagList = items
          .filter(
            (tag) =>
              tag.name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) >=
              0
          )
          .slice(0, 20);
        return tagList;
      }
    },
    []
  );
  const renderNewItem = React.useCallback(
    (query: string, active: boolean, handleClick: any) => {
      return (
        <MenuItem
          active={active}
          icon={IconNames.ADD}
          onClick={handleClick}
          text={`Create new tag "${query}"`}
          shouldDismissPopover={false}
        />
      );
    },
    []
  );
  const renderItem = React.useCallback(
    (tag: Asset.Types.Tag, { modifiers, handleClick }: ItemRendererProps) => {
      const icon =
        tag.id === EmptyQuery
          ? IconNames.BLANK
          : assetPack.tagIds.indexOf(tag.id) >= 0
          ? IconNames.TICK
          : IconNames.BLANK;
      return (
        <MenuItem
          active={tag.id === EmptyQuery ? false : modifiers.active}
          icon={icon}
          key={tag.id}
          onClick={handleClick}
          text={tag.name}
          shouldDismissPopover={false}
        />
      );
    },
    []
  );
  const renderTag = React.useCallback((tag: Asset.Types.Tag) => tag.name, []);
  const onSelectTag = React.useCallback(
    (tag: Asset.Types.Tag) => {
      if (tagIndex.byId[tag.id] == null) {
        dispatchers.assets.createAndAddTag({ tag, assetPackId: assetPack.id });
      } else {
        dispatchers.assets.addTagToAssetPack({
          tagId: tag.id,
          assetPackId: assetPack.id,
        });
      }
    },
    [dispatchers, assetPack.id]
  );
  const createNewTag = React.useCallback((query: string): Asset.Types.Tag => {
    return { id: generateRandomString(), name: query };
  }, []);
  const removeTag = React.useCallback(
    (_: React.ReactNode, index: number) => {
      const tag = selectedTags[index];
      dispatchers.assets.removeTagFromAssetPack({
        tagId: tag.id,
        assetPackId: assetPack.id,
      });
    },
    [dispatchers, assetPack.id]
  );
  return (
    <TagSelect
      fill
      resetOnSelect
      items={allTags}
      selectedItems={selectedTags}
      createNewItemFromQuery={createNewTag}
      createNewItemRenderer={renderNewItem}
      itemListPredicate={tagListPredicate}
      itemRenderer={renderItem}
      tagRenderer={renderTag}
      onItemSelect={onSelectTag}
      createNewItemPosition="first"
      tagInputProps={{
        onRemove: removeTag,
        tagProps: TagProps,
      }}
      placeholder="Search Tags..."
    />
  );
});
