import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '../../../redux/grid/GridTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getControlPoints } from '../../../redux/model/ControlPoints';
import { Model } from '../../../redux/model/ModelTypes';
import { SelectionOutlineColor } from './FeatureOutlines';
import { compact } from '../../../utils/array';

interface Props {
  feature: Model.Types.BasicAssetFeature;
}

export const ControlPointsOverlay = () => {
  const selection = useSelector(LayerTree.Selectors.getSelectedNodes);
  const featureIndex = useSelector(Model.Selectors.getFeatures);
  const transform = useSelector(Grid.Selectors.getTransform);
  const features = compact(selection.map((featureId) => featureIndex.byId[featureId]));
  const controlPoints = getControlPoints(transform, features);

  const strokeWidth = transform.applyScalar(1);
  const controlPointSvgs = [];
  for (const controlPoint of controlPoints) {
    const { p1, p2 } = controlPoint.rectangle;
    controlPointSvgs.push(<rect
      id={controlPoint.id}
      x={p1.x}
      y={p1.y}
      width={p2.x - p1.x}
      height={p2.y - p1.y}
      stroke={SelectionOutlineColor}
      strokeWidth={strokeWidth}
      fill={Colors.WHITE}
      cursor={controlPoint.cursor}
    />);
  }
  return <g>{controlPointSvgs}</g>;
};
