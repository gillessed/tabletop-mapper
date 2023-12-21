import { Classes, NumericInput, Popover, PopoverInteractionKind, Switch } from '@blueprintjs/core';
import * as React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { Model } from '../../redux/model/ModelTypes';
import "./GridSettingsForm.scss";

export function GridSettingsForm() {
  const { backgroundColor, gridColor, showGrid, majorAxisStep } = useSelector(Model.Selectors.getSettings);
  const dispatchers = useDispatchers();
  const setBackgroundColor = React.useCallback((color: ColorResult) => {
    dispatchers.model.setBackgroundColor(color.hex);
  }, [dispatchers]);
  const setGridColor = React.useCallback((color: ColorResult) => {
    dispatchers.model.setGridColor(color.hex);
  }, [dispatchers]);
  const setShowGrid = React.useCallback((event: React.FormEvent) => {
    dispatchers.model.setShowGrid((event.target as HTMLInputElement).checked);
  }, [dispatchers]);
  const setMajorAxis = React.useCallback((value: number) => {
    dispatchers.model.setMajorAxisStep(value);
  }, [dispatchers]);
  return (
    <div className='grid-settings-form'>
      <div className='settings-item'>
        <div className='title'>Background Color</div>
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
        >
          <div className='color-preview' style={{ backgroundColor }} />
          <div>
            <SketchPicker
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>
        </Popover>
      </div>
      <div className='settings-item'>
        <div className='title'>Show Grid</div>
        <Switch
          className='settings-switch'
          checked={showGrid}
          onChange={setShowGrid}
        />
      </div>
      <div className='settings-item'>
        <div className='title'>Grid Color</div>
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
        >
          <div className='color-preview' style={{ backgroundColor: gridColor }} />
          <div>
            <SketchPicker
              color={gridColor}
              onChange={setGridColor}
            />
          </div>
        </Popover>
      </div>
      <div className='settings-item'>
        <div className='title'>Major Grid Axis</div>
        <NumericInput
          className={Classes.DARK}
          value={majorAxisStep}
          onValueChange={setMajorAxis}
        />
      </div>
    </div >
  )
}
