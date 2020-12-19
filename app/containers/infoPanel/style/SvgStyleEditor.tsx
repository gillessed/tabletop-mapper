import * as React from "react";
import { Model } from "../../../redux/model/ModelTypes";
import { StyleProperty } from "./StyleProperty";
import { NumericInput, Slider, Popover, IPopoverProps } from "@blueprintjs/core";
import { ChromePicker, ColorResult } from "react-color";
import { useDispatchers } from "../../../DispatcherContextProvider";

export namespace SvgStyleEditor {
  export interface Props {
    style: Model.Types.SvgStyle;
  }
}

export const SvgStyleEditor = React.memo(function SvgStyleEditor({
  style
}: SvgStyleEditor.Props) {
  const dispatchers = useDispatchers();
  const hasStroke = style.stroke != null && style.stroke !== 'none';
  const hasFill = style.fill != null && style.fill !== 'none';
  const onSetStrokeColor = React.useCallback((result: ColorResult) => {
    const newStyle: Model.Types.SvgStyle = { ...style, stroke: result.hex };
    dispatchers.model.setStyle(newStyle);
  }, [dispatchers, style]);
  const onSetStrokeWidth = React.useCallback((value: number) => {
    const newStyle: Model.Types.SvgStyle = { ...style, strokeWidth: value };
    dispatchers.model.setStyle(newStyle);
  }, [dispatchers, style]);
  const onSetStrokeOpacity = React.useCallback((value: number) => {
    const newStyle: Model.Types.SvgStyle = { ...style, strokeOpacity: value };
    dispatchers.model.setStyle(newStyle);
  }, [dispatchers, style]);
  return (
    <>
      <StyleProperty name='Stroke' >
        {hasStroke && style.editable && <Popover 
          interactionKind='hover'
        >
          <div className='color-preview' style={{ backgroundColor: style.stroke }} />
          <div className='color-picker'>
            <ChromePicker
              color={style.stroke}
              onChange={onSetStrokeColor}
            />
          </div>
        </Popover>
        }
        {hasStroke && !style.editable &&
          <div className='color-preview disabled' style={{ backgroundColor: style.stroke }} />
        }
        {!hasStroke && 'None'}
      </StyleProperty>
      {style.strokeWidth != null && <StyleProperty name='Stroke Width' >
        <NumericInput
          fill
          min={0}
          max={100}
          stepSize={0.1}
          disabled={!style.editable}
          value={style.strokeWidth}
          onValueChange={onSetStrokeWidth}
        />
      </StyleProperty>}
      {style.strokeOpacity != null && <StyleProperty name='Stroke Opacity' >
        <div className='slider-property-row'>
          <Slider
            min={0}
            max={1}
            stepSize={0.01}
            disabled={!style.editable}
            value={style.strokeOpacity}
            labelStepSize={0.5}
            labelRenderer={(value: number) => `${Math.round(value * 100)}%`}
            onChange={onSetStrokeOpacity}
          />
        </div>
      </StyleProperty>}
      <StyleProperty name='Fill' >
        {hasFill && <div className='color-preview' style={{ backgroundColor: style.fill }} />}
        {!hasFill && 'None'}
      </StyleProperty>
      {style.fillOpacity != null && <StyleProperty name='Fill Opacity' >
        <div className='slider-property-row'>
          <Slider
            min={0}
            max={100}
            value={style.fillOpacity * 100}
            disabled={!style.editable}
            labelStepSize={50}
            labelRenderer={(value: number) => `${value}%`}
          />
        </div>
      </StyleProperty>}
    </>
  );
});
