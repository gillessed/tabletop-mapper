import { SearchKey } from "../../containers/leftPanel/assets/SearchKey";
import { copyIndexable, Identifiable, Indexable } from "../utils/indexable";
import { Asset } from "./AssetTypes";

function removeFromIndex<I extends Identifiable>(index: Indexable<I>, id: string) {
  index.all.splice(index.all.indexOf(id), 1);
  delete index.byId[id];
}

export function filterAssets(
  state: Asset.Types.State,
  searchKeys: SearchKey[],
): Asset.Types.State {
  if (searchKeys.length === 0) {
    return state;
  }

  const { assetIndex, assetPackIndex } = state;
  const newState = {
    ...state,
    assetIndex: copyIndexable(assetIndex),
    assetPackIndex: copyIndexable(assetPackIndex),
  };


  const searchTagsIds: string[] = [];
  for (const key of searchKeys) {
    if (key.type === "tag") {
      searchTagsIds.push(key.tagId);
    }
  }
  for (const assetPackId of [...newState.assetPackIndex.all]) {
    const assetPack = assetPackIndex.byId[assetPackId];
    const assetPackTags = new Set(assetPack.tagIds);
    const matchesTags = searchTagsIds.reduce((acc, val) => assetPackTags.has(val) && acc, true);
    if (!matchesTags) {
      removeFromIndex(newState.assetPackIndex, assetPackId);
    }
  }
  
  const filteredAssets = new Set<string>();
  for (const assetPackId of newState.assetPackIndex.all) {
    const assetPack = assetPackIndex.byId[assetPackId];
    for (const assetId of assetPack.assetIds) {
      filteredAssets.add(assetId);
    }
  }

  const searchKeywords = searchKeys.filter((s) => s.type === 'keyword').map((s) => s.query.toLocaleLowerCase());
  for (const assetId of [...assetIndex.all]) {
    const asset = assetIndex.byId[assetId];
    const name = asset.name.toLocaleLowerCase();
    const matchesKeywords = searchKeywords.reduce((acc, val) => name.indexOf(val) >= 0 && acc, true);
    if (!filteredAssets.has(assetId) || !matchesKeywords) {
      removeFromIndex(newState.assetIndex, assetId);
    }
  }

  for (const assetPackId of [...newState.assetPackIndex.all]) {
    const assetPack = newState.assetPackIndex.byId[assetPackId];
    const hasAssets = assetPack.assetIds.reduce((acc, val) => newState.assetIndex.byId[val] != null || acc, false);
    if (!hasAssets) {
      removeFromIndex(newState.assetPackIndex, assetPackId);
    }
  }

  return newState;``
}