import { Icon, Switch, Classes } from '@blueprintjs/core';
import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import './FeatureView.scss';
import { useDispatchers } from '../../../DispatcherContextProvider';

export namespace PathClosedSwitch {
  export interface Props {
    path: Model.Types.Feature<Model.Types.Path>;
  }
}

export const PathClosedSwitch = React.memo(function PathClosedSwitch({
  path,
}: PathClosedSwitch.Props) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((event: React.FormEvent) => {
    dispatchers.model.setPathsClosed({ pathIds: [path.id], closed: (event.target as HTMLInputElement).checked });
  }, [dispatchers, path]);
  return (
    <Switch
      className={Classes.DARK}
      label='Closed path'
      checked={!!path.geometry.closed}
      onChange={onChange}
    />
  );
});
