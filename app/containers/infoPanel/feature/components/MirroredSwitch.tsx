import { Classes, Switch } from '@blueprintjs/core';
import * as React from 'react';
import { useDispatchers } from '../../../../DispatcherContextProvider';

export interface MirroredSwitchProps {
  featureId: string;
  mirrored: boolean;
}

export const MirroredSwitch = React.memo(function MirroredSwitch({
  featureId,
  mirrored,
}: MirroredSwitchProps) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((event: React.FormEvent) => {
    dispatchers.model.setMirrored({
      featureIds: [featureId],
     value: (event.target as HTMLInputElement).checked });
  }, [dispatchers, featureId]);
  return (
    <Switch
      className={Classes.DARK}
      label='Mirrored'
      checked={mirrored}
      onChange={onChange}
    />
  );
});
