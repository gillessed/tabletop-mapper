import * as React from 'react';
import { useSelector } from "react-redux";
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getOutlineForFeature, OutlinePixelStrokeWidth } from '../../../redux/model/FeatureOutline';
import { Model } from '../../../redux/model/ModelTypes';
import { Transform } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { Colors } from '@blueprintjs/core';
import { CompoundSelectors } from '../../../redux/CompoundSelectors';
import "./FeatureOutlines.scss";
import classNames from 'classnames';
import { getHighestFeatureId } from '../../../redux/model/ModelTree';

export const SelectionOutlineColor = Colors.ORANGE3;
export const HoverOutlineColor = Colors.COBALT3;

function renderOutline(
  geometry: Model.Types.Rectangle,
  transform: Transform,
  color: string,
  hoverCrosshair?: boolean,
): JSX.Element | null {
  if (geometry === null) {
    return null;
  };
  const classes = classNames({
    ['hover-selected']: hoverCrosshair,
  });
  const strokeWidth = transform.applyScalar(OutlinePixelStrokeWidth);
  const { p1, p2 } = geometry;
  return (
    <rect
      x={p1.x - strokeWidth / 2}
      y={p1.y - strokeWidth / 2}
      width={p2.x - p1.x + strokeWidth}
      height={p2.y - p1.y + strokeWidth}
      fill='none'
      stroke={color}
      strokeWidth={strokeWidth}
      className={classes}
    />
  );
}

export const FeatureOutlines = function Features() {
  const features = useSelector(Model.Selectors.getFeatures);
  const layers = useSelector(Model.Selectors.getLayers);
  const selectedNodes = useSelector(LayerTree.Selectors.getSelectedNodes);
  const transform = useSelector(Grid.Selectors.getTransform);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);

  const selectedFeatures: Model.Types.Feature[] = [];
  for (const id of selectedNodes) {
    const feature = features.byId[id];
    if (feature != null) {
      selectedFeatures.push(feature);
    }
  }
  const hoveredFeatureIds = useSelector(CompoundSelectors.getHoveredFeaturesMemoized);
  const hoveringSelectedFeature = selectedFeatures.find((feature) => hoveredFeatureIds.indexOf(feature.id) >= 0);
  const resizing = mouseMode === Grid.Types.MouseMode.ResizePath || mouseMode === Grid.Types.MouseMode.ResizeRectangle;

  const selectedFeatureOutlines = selectedFeatures.map((feature) => {
    const outline = getOutlineForFeature(feature);
    const hovered = hoveredFeatureIds.indexOf(feature.id) >= 0;
    const renderedOutline = renderOutline(outline, transform, SelectionOutlineColor, hovered && !resizing);
    return renderedOutline;
  });

  const renderHoverOutlines = (
    mouseMode === Grid.Types.MouseMode.None &&
    hoveredFeatureIds.length > 0 &&
    !hoveringSelectedFeature
  );

  function HoverOutline(): JSX.Element {
    const highestFeatureId = getHighestFeatureId(features, layers, hoveredFeatureIds);
    const highestFeature = features.byId[highestFeatureId];
    const highestFeatureOutline = getOutlineForFeature(highestFeature);
    const renderedHoverOutline = renderOutline(highestFeatureOutline, transform, HoverOutlineColor);
    return renderedHoverOutline;
  }

  return (
    <g className='feature-outlines'>
      <g className='selected-features'>{selectedFeatureOutlines}</g>
      <g className='hovered-features'>
        {renderHoverOutlines && <HoverOutline />}
      </g>
    </g>
  );
};
