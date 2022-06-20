import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { rectifyRectangle } from '../../../../math/RectifyGeometry';
import { Grid } from '../../../../redux/grid/GridTypes';
import { translateRectangle } from '../../../../redux/model/FeatureTranslation';
import { Model } from '../../../../redux/model/ModelTypes';
import "./ClipRegionWidget.scss";

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
  const editingFeatureClipRegion = useSelector(Grid.Selectors.getEditingFeatureClipRegion);
  const onSetClipRegion = React.useCallback(() => {
    const rectifiedGeometry = rectifyRectangle(geometry);
    const clipRegion = translateRectangle({ x: -rectifiedGeometry.p1.x, y: -rectifiedGeometry.p1.y }, rectifiedGeometry);
    dispatchers.model.setClipRegion({
      featureIds: [featureId],
      value: clipRegion,
    })
    dispatchers.grid.editClipRegion(featureId); ` `
  }, [dispatchers, geometry, featureId]);
  const onClearClipRegion = React.useCallback(() => {
    dispatchers.model.setClipRegion({ featureIds: [featureId], value: undefined });
    dispatchers.grid.finishEditClipRegion();
  }, [dispatchers, featureId]);
  const onSetRegion = React.useCallback(() => {
    dispatchers.grid.finishEditClipRegion();
  }, [dispatchers]);
  const onEditClipRegion = React.useCallback(() => {
    dispatchers.grid.editClipRegion(featureId); ` `
  }, [dispatchers, geometry, featureId]);
  const editing = editingFeatureClipRegion === featureId;
  if (clipRegion == null) {
    return (
      <Button
        text="Set Clip Region"
        intent={Intent.PRIMARY}
        onClick={onSetClipRegion}
      />
    )
  }
  const { p1, p2 } = clipRegion;
  return (
    <div className='clip-region-widget'>
      <span className='clip-region-size'>{p2.x - p1.x} x {p2.y - p1.y}</span>
      <div className='spacer' />
      {!editing && <Button icon={IconNames.EDIT} intent={Intent.PRIMARY} onClick={onEditClipRegion} />}
      {editing && <Button icon={IconNames.TRASH} intent={Intent.DANGER} onClick={onClearClipRegion} />}
      {editing && <Button icon={IconNames.CONFIRM} intent={Intent.PRIMARY} onClick={onSetRegion} />}
    </div>
  );
});
