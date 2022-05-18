import { Classes, Switch } from '@blueprintjs/core';
import { string } from 'prop-types';
import * as React from 'react';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { Model } from '../../../../redux/model/ModelTypes';

export interface SnapToGridSwitchProps {
  featureId: string;
  snapToGrid: boolean;
}

export const SnapToGridSwitch = React.memo(function SnapToGridSwitch({
  featureId,
  snapToGrid,
}: SnapToGridSwitchProps) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((event: React.FormEvent) => {
    dispatchers.model.setSnapToGrid({ featureIds: [featureId], value: (event.target as HTMLInputElement).checked });
  }, [dispatchers, featureId]);
  return (
    <Switch
      className={Classes.DARK}
      label='Snaps to grid'
      checked={snapToGrid}
      onChange={onChange}
    />
  );
});
