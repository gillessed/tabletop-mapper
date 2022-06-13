import { Button, Classes, Intent, Switch } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { rectifyRectangle } from '../../../../math/RectifyGeometry';
import { translateGeometry, translateRectangle } from '../../../../redux/model/FeatureTranslation';
import { Model } from '../../../../redux/model/ModelTypes';

export interface ClipRegionWidgetProps {
  featureId: string;
  geometry: Model.Types.Rectangle;
  clipRegion?: Model.Types.Rectangle;
}

export const ClipRegionWidget = React.memo(({
  featureId,
  geometry,
  clipRegion,
}: ClipRegionWidgetProps) => {
  const dispatchers = useDispatchers();
  const onSetClipRegion = React.useCallback(() => {
    const rectifiedGeometry = rectifyRectangle(geometry);
    const clipRegion = translateRectangle({ x: -rectifiedGeometry.p1.x, y: -rectifiedGeometry.p1.y }, rectifiedGeometry);
    dispatchers.model.setClipRegion({
      featureIds: [featureId],
      value: clipRegion,
    })
    dispatchers.grid.editClipRegion(featureId);` `
  }, [dispatchers, geometry, featureId]);
  if (clipRegion == null) {
    return (
      <Button
        text="Set Clip Region"
        intent={Intent.PRIMARY}
        onClick={onSetClipRegion}
      />
    )
  }
  return (
    <div>
      Some text
    </div>
  );
});
