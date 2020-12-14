import { Icon, Switch, Classes } from '@blueprintjs/core';
import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import './FeatureView.scss';
import { useDispatchers } from '../../../AppContextProvider';

export namespace SnapsToGridSwitch {
  export interface Props {
    feature: Model.Types.Feature;
  }
}

export const SnapsToGridSwitch = React.memo(function SnapsToGridSwitch({
  feature,
}: SnapsToGridSwitch.Props) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((e: React.FormEvent) => {
    dispatchers.model.setSnapsToGrid({ featureIds: [feature.id], snapsToGrid: (event.target as HTMLInputElement).checked });
  }, [dispatchers, feature]);
  return (
    <Switch
      className={Classes.DARK}
      label='Snaps to grid'
      checked={!!feature.geometry.snapToGrid}
      onChange={onChange}
    />
  );
});
