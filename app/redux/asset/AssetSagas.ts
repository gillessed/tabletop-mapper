import { all, takeEvery, call, put, select } from "redux-saga/effects";
import { SagaContext } from "../AppSaga";
import { TypedAction } from "../utils/typedAction";
import { Asset } from "./AssetTypes";
import { renderProgressToast } from "../../containers/toast/ProgressToast";
import { generateRandomString } from "../../utils/randomId";
import { writeAssetDataFile } from "./AssetDataFile";
import { Indexable } from "../utils/indexable";
import { Filer } from "../../../filer/filer";

export function* assetSaga(context: SagaContext) {
  yield all([
    takeEvery(Asset.Actions.importAssets.type, importAssetsSaga, context),
    takeEvery(Asset.Actions.saveAssetFile.type, saveAssetDataFile, context),

    takeEvery(Asset.Actions.upsertAsset.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.setAssetName.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.removeAsset.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.upsertAssetPack.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.setAssetPackName.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.removeAssetPack.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.upsertTag.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.setTagName.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.removeTag.type, saveAssetDataFile, context),
    takeEvery(Asset.Actions.addTagToAssetPack.type, saveAssetDataFile, context),
    takeEvery(
      Asset.Actions.removeTagFromAssetPack.type,
      saveAssetDataFile,
      context
    ),
    takeEvery(Asset.Actions.createAndAddTag.type, saveAssetDataFile, context),
  ]);
}

async function getFilesToImport(paths: string[]): Promise<Filer[]> {
  const filesToImport: Filer[] = [];
  for (const path of paths) {
    const fileToImport = Filer.open(path);
    await fileToImport.treeWalk({
      onFile: (file: Filer) => {
        if (file.isImage()) {
          filesToImport.unshift(file);
        }
      },
    });
  }
  return filesToImport;
}

const NewBackBaseName = "New Asset Pack";
function getNewAssetPackName(assetPackIndex: Indexable<Asset.Types.AssetPack>) {
  const allPackNames = new Set<string>();
  for (const assetPackId of assetPackIndex.all) {
    allPackNames.add(assetPackIndex.byId[assetPackId].name);
  }
  let packIndex = 1;
  while (allPackNames.has(NewBackBaseName + " " + packIndex)) {
    packIndex++;
  }
  return NewBackBaseName + " " + packIndex;
}

function* importAssetsSaga(
  context: SagaContext,
  action: TypedAction<string[]>
) {
  const { appConfig, appToaster } = context;
  const filesToImport: Filer[] = yield call(getFilesToImport, action.payload);
  const toastKey = renderProgressToast(appToaster, 0);
  const assetPackIndex: ReturnType<typeof Asset.Selectors.getAssetPackIndex> =
    yield select(Asset.Selectors.getAssetPackIndex);
  const packName = getNewAssetPackName(assetPackIndex);
  const newAssetPack: Asset.Types.AssetPack = {
    id: generateRandomString(),
    name: packName,
    assetIds: [],
    tagIds: [],
  };
  yield put(Asset.Actions.upsertAssetPack.create(newAssetPack));
  yield put(
    Asset.Actions.setViewState.create({ type: "pack", item: newAssetPack.id })
  );
  let progress = 0;
  pauseAssetFileSave = true;
  for (const fileToImport of filesToImport) {
    try {
      const originalExtension = fileToImport.extension;
      const newAsset: Asset.Types.Asset = {
        id: generateRandomString(),
        name: fileToImport.getFilenameWithoutExtension(),
        extension: originalExtension,
        assetPackId: newAssetPack.id,
      };
      const target = appConfig.getAssetFileById(newAsset.id, originalExtension);
      yield call(target.getParent().mkdirP);
      yield call(fileToImport.queueCopyTo, target, context.fileCopier);
      yield put(Asset.Actions.upsertAsset.create(newAsset));
    } catch (error) {
      console.error(error);
    } finally {
      progress++;
      renderProgressToast(
        appToaster,
        progress / filesToImport.length,
        toastKey
      );
    }
  }
  pauseAssetFileSave = false;
  yield put(Asset.Actions.saveAssetFile.create());
}

let pauseAssetFileSave = false;
let writingAssetFile = false;
let queuedWrite = false;

function* saveAssetDataFile(context: SagaContext) {
  if (pauseAssetFileSave) {
    queuedWrite = false;
    return;
  }
  if (writingAssetFile === true) {
    queuedWrite = true;
    return;
  } else {
    writingAssetFile = true;
  }
  const { appConfig } = context;
  const assetState: ReturnType<typeof Asset.Selectors.get> = yield select(
    Asset.Selectors.get
  );
  writeAssetDataFile(appConfig, assetState);
  writingAssetFile = false;
  if (queuedWrite) {
    queuedWrite = false;
    yield put(Asset.Actions.saveAssetFile.create());
  }
}
