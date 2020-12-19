import { Button, PopoverPosition, Tooltip } from '@blueprintjs/core';
import * as React from 'react';
import { Dispatchers } from '../../redux/Dispatchers';
import { Grid } from '../../redux/grid/GridTypes';
import { Model } from '../../redux/model/ModelTypes';
import { useDispatchers } from '../../DispatcherContextProvider';
import { useSelector } from 'react-redux';

export namespace FeatureButton {
  export interface Props {
    geometryInfo: Model.Types.GeometryInfo;
  }
}

export const FeatureButton = React.memo(function FeatureButton({
  geometryInfo,
}: FeatureButton.Props) {
  const dispatchers = useDispatchers();
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);

  const onClick = React.useCallback(() => {
    dispatchers.grid.startDraw(geometryInfo.id);
  }, [dispatchers, geometryInfo]);

  return (
    <Tooltip content={geometryInfo.name} position={PopoverPosition.BOTTOM}>
      <Button
        className='feature-button'
        icon={geometryInfo.icon}
        onClick={onClick}
        active={mouseMode === geometryInfo.mouseMode}
      />
    </Tooltip>
  );
});
