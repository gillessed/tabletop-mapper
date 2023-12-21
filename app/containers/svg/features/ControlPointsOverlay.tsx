import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '../../../redux/grid/GridTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getControlPoints } from '../../../redux/model/ControlPoints';
import { Model } from '../../../redux/model/ModelTypes';
import { SelectionOutlineColor } from './FeatureOutlines';
import { compact } from '../../../utils/array';
import { ControlPointsComponent } from './ControlPointsComponent';

export const ControlPointsOverlay = React.memo(function ControlPointsOverlay() {
  const selection = useSelector(LayerTree.Selectors.getSelectedNodes);
  const featureIndex = useSelector(Model.Selectors.getFeatures);
  const transform = useSelector(Grid.Selectors.getTransform);
  const features = compact(selection.map((featureId) => featureIndex.byId[featureId]));
  const controlPoints = getControlPoints(transform, features);
  const editingFeatureClipRegion = useSelector(Grid.Selectors.getEditingFeatureClipRegion);
  if (editingFeatureClipRegion || controlPoints.length === 0) {
    return null;
  }

  return (
    <ControlPointsComponent
      controlPoints={controlPoints}
      strokeColor={SelectionOutlineColor}
    />
  );
});
