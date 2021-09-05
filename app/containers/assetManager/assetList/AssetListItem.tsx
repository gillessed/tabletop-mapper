import * as React from 'react';
import { Asset } from '../../../redux/asset/AssetTypes';
import './AssetListItem.scss';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { EditableText, NumericInput } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { useDispatchers } from '../../../DispatcherContextProvider';

export namespace AssetListItem {
  export interface Props {
    asset: Asset.Types.Asset;
  }
}

export const AssetListItem = React.memo(function AssetListItem({
  asset
}: AssetListItem.Props) {
  const dispatchers = useDispatchers();
  const handleChangeName = React.useCallback((newName: string) => {
    dispatchers.assets.setAssetName({
      id: asset.id,
      name: newName,
    });
  }, [dispatchers, asset.id]);
  const [editName, setEditNameValue] = React.useState(asset.name);
  const appConfig = useAppConfig();
  const file = appConfig.getAssetFileById(asset.id, asset.extension);
  const setGridDimensions = React.useCallback((dimensions: Asset.Types.Dimensions) => {
    const newAsset = { ...asset, gridDimensions: dimensions };
    dispatchers.assets.upsertAsset(newAsset);
  }, [asset, dispatchers]);
  const setx = React.useCallback((value: number) => {
    setGridDimensions({ x: value, y: asset.gridDimensions?.y ?? 1 });
  }, [setGridDimensions, asset]);
  const sety = React.useCallback((value: number) => {
    setGridDimensions({ x: asset.gridDimensions?.x ?? 1, y: value });
  }, [setGridDimensions, asset]);
  return (
    <div className='grid-item asset-grid-item'>
      <div className='image-container'>
        <img
          className='asset-image'
          src={file.fullPath}
        />
      </div>
      <div className='title-container'>
        <EditableText
          className='title'
          value={editName}
          onChange={setEditNameValue}
          onConfirm={handleChangeName}
        />
      </div>
      <NumericInput
        className='grid-dimension-input left-input'
        min={1}
        max={99}
        majorStepSize={5}
        stepSize={1}
        clampValueOnBlur
        value={asset.gridDimensions?.x ?? 1}
        onValueChange={setx}
      />
      x
      <NumericInput
        className='grid-dimension-input right-input'
        min={1}
        max={99}
        majorStepSize={5}
        stepSize={1}
        clampValueOnBlur
        value={asset.gridDimensions?.y ?? 1}
        onValueChange={sety}
      />
    </div>
  );
});
