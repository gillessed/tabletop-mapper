import { ReduxState } from "../AppReducer";
import { Identifiable, Indexable, DeleteIndexablePayload, SetNamePayload } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Asset {
  export namespace Types {

    export interface State {
      assetIndex: Indexable<Asset>;
      assetPackIndex: Indexable<AssetPack>;
      tagIndex: Indexable<Tag>;
    }

    export interface Asset extends Identifiable {
      extension: string;
      gridDimensions?: { x: number, y: number};
      tagIds: string[];
      assetPackId: string;
    }

    export interface AssetPack extends Identifiable {
      assetIds: string[];
      tagIds: string[];
    }

    export interface Tag extends Identifiable {}

    export function isAsset(asset: Asset | AssetPack): asset is Asset {
      return (asset as Asset).assetPackId != null;
    }

    export function isAssetPack(asset: Asset | AssetPack): asset is AssetPack {
      return (asset as AssetPack).assetIds != null;
    }

    export type AssetItem = Asset | AssetPack;
  }

  export const DispatchActions = {
    importAssets: createActionWrapper<string[]>('asset::importAssets'),
    upsertAsset: createActionWrapper<Asset.Types.Asset>('asset::upsertAsset'),
    upsertAssetPack: createActionWrapper<Asset.Types.AssetPack>('asset::upsertAssetPack'),
    upsertTag: createActionWrapper<Asset.Types.Tag>('asset::upsertTag'),
    setAssetName: createActionWrapper<SetNamePayload>('asset:setAssetName'),
    setAssetPackName: createActionWrapper<SetNamePayload>('asset:setAssetPackName'),
    setTagName: createActionWrapper<SetNamePayload>('asset:setTagName'),
    removeAsset: createActionWrapper<DeleteIndexablePayload>('asset:removeAsset'),
    removeAssetPack: createActionWrapper<DeleteIndexablePayload>('asset:removeAssetPack'),
    removeTag: createActionWrapper<DeleteIndexablePayload>('asset:removeTag'),
  }

  export const Actions = {
    setAssetState: createActionWrapper<Asset.Types.State>('asset::setAssetState'),
    saveAssetFile: createActionWrapper<void>('asset::saveAssetFile'),
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.assets;
    export const getAssetIndex = (state: ReduxState) => get(state).assetIndex;
    export const getAssetPackIndex = (state: ReduxState) => get(state).assetPackIndex;
    export const getTagIndex = (state: ReduxState) => get(state).tagIndex;
  }
}
