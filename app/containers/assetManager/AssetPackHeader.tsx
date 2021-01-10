import * as React from 'react';
import { useAppConfig } from '../../AppConfigContextProvider';
import './AssetPackHeader.scss';
import { EditableText, Callout, Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export namespace AssetPackHeader {
  export interface Props {
    assetPackName: string;
  }
}

export const AssetPackHeader = React.memo(function AssetPackHeader({
  assetPackName
}: AssetPackHeader.Props) {
  const appConfig = useAppConfig();
  return (
    <div className='asset-pack-header'>
      <EditableText
        value={assetPackName}
      />
      <Button 
        icon={IconNames.CROSS}
        intent={Intent.PRIMARY}
      />
    </div>
  );
});
