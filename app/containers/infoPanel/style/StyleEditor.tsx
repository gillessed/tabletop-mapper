import { Button, ControlGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip, EditableText } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";
import { DefaultBasicAssetStyle, DefaultSvgStyle } from "../../../redux/model/DefaultStyles";
import { Model } from "../../../redux/model/ModelTypes";
import { visitStyle } from "../../../redux/model/ModelVisitors";
import { NewStyleMenuItem } from "./NewStyleMenuItem";
import "./StyleEditor.scss";
import { StyleProperty } from "./StyleProperty";
import { StyleSelect } from "./StyleSelect";
import { SvgStyleEditor } from "./SvgStyleEditor";
import { useDispatchers } from "../../../DispatcherContextProvider";
import { generateRandomString } from "../../../utils/randomId";

export namespace StyleEditor {
  export interface Props {
    style: Model.Types.Style;
    editingFeatureId?: string;
  }
}

export const StyleEditor = React.memo(function StyleEditor({
  style, editingFeatureId
}: StyleEditor.Props) {
  const form = visitStyle({
    visitSvgStyle: (svgStyle) => <SvgStyleEditor style={svgStyle} />,
    visitBasicAssetStyle: () => null,
  }, style);
  const dispatchers = useDispatchers();
  const onChangeStyleName = React.useCallback((value: string) => {
    if (editingFeatureId != null) {
      const newStyle = { ...style, name: value };
      dispatchers.model.setStyle(newStyle);
    }
  }, [dispatchers, editingFeatureId, style]);
  const onClickDuplicateStyle = React.useCallback(() => {
    const newStyle = { ...style, name: style.name + ' (Copy)', id: generateRandomString(), editable: true };
    dispatchers.model.setStyle(newStyle);
    if(editingFeatureId != null) {
      dispatchers.model.setFeatureStyle({ featureIds: [editingFeatureId], styleId: newStyle.id });
    }
  }, [dispatchers, editingFeatureId, style]);
  return (
    <div className='style-editor'>
      <div className='style-picker'>
        <ControlGroup fill>
          <StyleSelect selectedStyle={style} editingFeatureId={editingFeatureId} />
          <Popover interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM_LEFT}>
            <Tooltip content='Create new style'>
              <Button icon={IconNames.NEW_LAYER} fill />
            </Tooltip>
            <Menu>
              <NewStyleMenuItem
                style={DefaultSvgStyle}
                editingFeatureId={editingFeatureId}
              />
              <NewStyleMenuItem
                style={DefaultBasicAssetStyle}
                editingFeatureId={editingFeatureId}
              />
            </Menu>
          </Popover>
          <Tooltip content={`Clone '${style.name}'`}>
            <Button
              fill
              icon={IconNames.DUPLICATE}
              onClick={onClickDuplicateStyle}
            />
          </Tooltip>
        </ControlGroup>
      </div>
      <StyleProperty name='Style Name'>
        {style.editable && <EditableText
          value={style.name}
          onChange={onChangeStyleName}
        />}
        {!style.editable && style.name}
      </StyleProperty>
      {form}
    </div>
  );
});
