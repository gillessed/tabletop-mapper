import { Button, Classes, Intent, Switch, Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { expandRectangle } from '../../../../math/ExpandGeometry';
import { rectifyRectangle } from '../../../../math/RectifyGeometry';
import { Grid } from '../../../../redux/grid/GridTypes';
import { getRectangleControlPoints } from '../../../../redux/model/ControlPoints';
import { OutlinePixelStrokeWidth } from '../../../../redux/model/FeatureOutline';
import { translateRectangle } from '../../../../redux/model/FeatureTranslation';
import { Model } from '../../../../redux/model/ModelTypes';
import { rectToSvg } from '../../../../redux/model/SvgUtils';
import { SvgRectOutline } from '../components/SvgRectOutline';
import { ControlPointsComponent } from '../ControlPointsComponent';

export const ClipRegionColor = Colors.FOREST3;

export interface ClipRegionOverlayProps {
  width: number;
  height: number;
}

export const ClipRegionOverlay = React.memo(function ClipRegionOverlay({
  width,
  height,
}: ClipRegionOverlayProps) {
  const editingFeatureId = useSelector(Grid.Selectors.getEditingFeatureClipRegion);
  const editingFeature = useSelector(Model.Selectors.getFeatureById(editingFeatureId));
  const transform = useSelector(Grid.Selectors.getTransform);
  const resizedClipRegion = useSelector(Grid.Selectors.getResizedClipRegion);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  if (editingFeatureId == null || editingFeature == null || editingFeature.type != 'basic-asset' || editingFeature.clipRegion == null) {
    return null;
  }
  const { clipRegion, geometry } = editingFeature;
  const rectifiedGeometry = rectifyRectangle(geometry);
  const translatedClipRegion = translateRectangle(rectifiedGeometry.p1, clipRegion);
  const shadowP1 = transform.apply(0, 0);
  const shadowP2 = transform.apply(width, height);
  const outerRect = `M${shadowP1.x} ${shadowP1.y} L${shadowP2.x} ${shadowP1.y} L${shadowP2.x} ${shadowP2.y} L${shadowP1.x} ${shadowP2.y}`;
  const clipRegionShadowBorder = expandRectangle(geometry, transform.applyScalar(150));
  const { p1: innerP1, p2: innerP2 } = clipRegionShadowBorder;
  const innerRect = `M${innerP1.x} ${innerP1.y} L${innerP1.x} ${innerP2.y} L${innerP2.x} ${innerP2.y} L${innerP2.x} ${innerP1.y}`;
  const controlPoints = getRectangleControlPoints(transform, editingFeatureId, translatedClipRegion);
  const resizing = mouseMode === Grid.Types.MouseMode.ResizeClipRegion;
  const translatedClipRegionShadow = resizedClipRegion != null ? translateRectangle(rectifiedGeometry.p1, resizedClipRegion) : undefined;
  return (
    <g>
      <path d={`${outerRect} ${innerRect}`} fill={Colors.DARK_GRAY3} opacity={0.6} fillRule='evenodd' />
      <SvgRectOutline
        geometry={translatedClipRegion}
        color={ClipRegionColor}
        transform={transform}
        hoverCrosshair={!resizing}
      />
      {translatedClipRegionShadow != null && <SvgRectOutline
        geometry={translatedClipRegionShadow}
        color={ClipRegionColor}
        transform={transform}
      />}
      <ControlPointsComponent controlPoints={controlPoints} strokeColor={Colors.FOREST3} />
    </g>
  );
});
