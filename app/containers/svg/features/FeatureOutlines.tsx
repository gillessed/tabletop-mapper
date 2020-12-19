import * as React from 'react';
import { useSelector } from "react-redux";
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getOutlineForFeature } from '../../../redux/model/FeatureOutline';
import { Model } from '../../../redux/model/ModelTypes';
import { Transform } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { Colors } from '@blueprintjs/core';
import { CompoundSelectors } from '../../../redux/CompoundSelectors';
import "./FeatureOutlines.scss";
import classNames from 'classnames';
import { getHighestFeatureId } from '../../../redux/model/ModelTree';

const OutlinePixelStrokeWidth = 5;
const OutlinePixelPadding = 5;
const SelectionOutlineColor = Colors.ORANGE3;
const HoverOutlineColor = Colors.COBALT3;

function renderOutline(
  geometry: Model.Types.Geometry,
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
  if (Model.Types.isRectangle(geometry)) {
    const strokeWidth = transform.applyScalar(OutlinePixelStrokeWidth);
    const outlinePadding = transform.applyScalar(OutlinePixelPadding);
    const totalPadding = outlinePadding + strokeWidth / 2;
    const { p1, p2 } = geometry;
    return (
      <rect
        x={p1.x - totalPadding}
        y={p1.y - totalPadding}
        width={p2.x - p1.x + 2 * totalPadding}
        height={p2.y - p1.y + 2 * totalPadding}
        fill='none'
        stroke={color}
        strokeWidth={strokeWidth}
        className={classes}
      />
    );
  } else if (Model.Types.isCircle(geometry)) {
    const strokeWidth = transform.applyScalar(OutlinePixelStrokeWidth);
    const outlinePadding = transform.applyScalar(OutlinePixelPadding);
    const radius = geometry.r + outlinePadding + strokeWidth / 2;
    return (
      <circle
        cx={geometry.p.x}
        cy={geometry.p.y}
        r={radius}
        fill='none'
        stroke={color}
        strokeWidth={strokeWidth}
        className={classes}
      />
    )
  } else {
    console.error('Outline geometry should only be circles and rectangles', geometry);
    throw Error();
  }
}

export const FeatureOutlines = function Features() {
  const features = useSelector(Model.Selectors.getFeatures);
  const styles = useSelector(Model.Selectors.getStyles);
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

  const selectedFeatureOutlines = selectedFeatures.map((feature) => {
    const outline = getOutlineForFeature(feature, styles.byId[feature.styleId]);
    const hovered = hoveredFeatureIds.indexOf(feature.id) >= 0;
    const renderedOutline = renderOutline(outline, transform, SelectionOutlineColor, hovered);
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
    const highestFeatureOutline = getOutlineForFeature(highestFeature, styles.byId[highestFeature.styleId]);
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
