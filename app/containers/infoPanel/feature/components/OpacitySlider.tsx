import { Classes, Slider } from '@blueprintjs/core';
import * as React from 'react';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { Model } from '../../../../redux/model/ModelTypes';

export interface OpacitySliderProps {
  featureId: string;
  opacity: number;
}

export const OpacitySlider = React.memo(function OpacitySlider({
  featureId,
  opacity,
}: OpacitySliderProps) {
  const dispatchers = useDispatchers();
  const onChange = React.useCallback((value: number) => {
    dispatchers.model.setOpacity({ featureIds: [featureId], value });
  }, [dispatchers, featureId]);
  return (
    <Slider
      className={Classes.DARK}
      value={opacity}
      min={0}
      max={1}
      stepSize={0.01}
      onChange={onChange}
      labelRenderer={false}
    />
  );
});
