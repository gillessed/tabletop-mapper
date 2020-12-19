import { IconName, MenuItem } from "@blueprintjs/core";
import * as React from 'react';
import { useDispatchers } from '../../../DispatcherContextProvider';
import { DefaultStyle } from '../../../redux/model/DefaultStyles';
import { Model } from "../../../redux/model/ModelTypes";
import { generateRandomString } from '../../../utils/randomId';

export namespace NewStyleMenuItem {
  export interface Props {
    style: DefaultStyle;
    editingFeatureId?: string;
  }
}

export const NewStyleMenuItem = React.memo(function NewStyleMenuItem({
  style, editingFeatureId
}: NewStyleMenuItem.Props) {
  const dispatchers = useDispatchers();
  const onClick = React.useCallback(() => {
    const newStyle: Model.Types.Style = {
      ...style,
      id: generateRandomString(),
      name: 'New ' + style.nameTemplate,
      editable: true,
    }
    dispatchers.model.setStyle(newStyle);
    if (editingFeatureId) {
      dispatchers.model.setFeatureStyle({
        featureIds: [editingFeatureId],
        styleId: newStyle.id,
      });
    }
  }, [dispatchers, style, editingFeatureId]);
  return (
    <MenuItem 
      text={style.nameTemplate}
      icon={style.icon}
      onClick={onClick}
    />
  );
  
});
