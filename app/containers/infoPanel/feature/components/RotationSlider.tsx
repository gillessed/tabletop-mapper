import { Classes, Slider } from '@blueprintjs/core';
import * as React from 'react';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { Model } from '../../../../redux/model/ModelTypes';

export interface RotationSliderProps {
  featureId: string;
  rotation: number;
  snapToGrid: boolean;
}

export const RotationSlider = React.memo(function RotationSlider({
  featureId,
  rotation,
  snapToGrid,
}: RotationSliderProps) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((value: number) => {
    dispatchers.model.setRotation({ featureIds: [featureId], value });
  }, [dispatchers, featureId]);
  return (
    <Slider
      className={Classes.DARK}
      value={rotation}
      min={0}
      max={360}
      stepSize={snapToGrid ? 90 : 1}
      onChange={onChange}
      labelPrecision={0}
      labelStepSize={90}
    />
  );
});
