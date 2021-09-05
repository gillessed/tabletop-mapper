import { ReduxState } from "../AppReducer";
import { Identifiable, Indexable, DeleteIndexablePayload, SetNamePayload } from "../utils/indexable";
import { createActionWrapper } from "../utils/typedAction";

export namespace Asset {
  export namespace Types {
    export interface AssetViewState {
      type: 'search' | 'tag' | 'pack';
      item?: string;
    }

    export interface State {
      assetIndex: Indexable<Asset>;
      assetPackIndex: Indexable<AssetPack>;
      tagIndex: Indexable<Tag>;
      viewState: AssetViewState;
    }

    export interface Dimensions {
      x: number;
      y: number;
    }

    export interface Asset extends Identifiable {
      extension: string;
      gridDimensions?: Dimensions;
      tagIds: string[];
      assetPackId: string;
    }

    export interface AssetPack extends Identifiable {
      assetIds: string[];
      source?: string;
    }

    export interface Tag extends Identifiable { }
  }

  export const DispatchActions = {
    importAssets: createActionWrapper<string[]>('asset::importAssets'),
    upsertAsset: createActionWrapper<Asset.Types.Asset>('asset::upsertAsset'),
    upsertAssetPack: createActionWrapper<Asset.Types.AssetPack>('asset::upsertAssetPack'),
    upsertTag: createActionWrapper<Asset.Types.Tag>('asset::upsertTag'),
    setAssetName: createActionWrapper<SetNamePayload>('asset::setAssetName'),
    setAssetPackName: createActionWrapper<SetNamePayload>('asset::setAssetPackName'),
    setTagName: createActionWrapper<SetNamePayload>('asset::setTagName'),
    removeAsset: createActionWrapper<DeleteIndexablePayload>('asset::removeAsset'),
    removeAssetPack: createActionWrapper<DeleteIndexablePayload>('asset::removeAssetPack'),
    removeTag: createActionWrapper<DeleteIndexablePayload>('asset::removeTag'),
    setViewState: createActionWrapper<Types.AssetViewState>('asset::setViewState'),
  }

  export const Actions = {
    setAssetState: createActionWrapper<Asset.Types.State>('asset::setAssetState'),
    saveAssetFile: createActionWrapper<void>('asset::saveAssetFile'),
    ...DispatchActions,
  }

  export namespace Selectors {
    export const get = (state: ReduxState) => state.assets;
    export const getViewState = (state: ReduxState) => get(state).viewState;
    export const getAssetIndex = (state: ReduxState) => get(state).assetIndex;
    export const getAssetPackIndex = (state: ReduxState) => get(state).assetPackIndex;
    export const getTagIndex = (state: ReduxState) => get(state).tagIndex;
    export const getAssetById = (assetId: string) => (state: ReduxState) => getAssetIndex(state).byId[assetId];
  }
}
