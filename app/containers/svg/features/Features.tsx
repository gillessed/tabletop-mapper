import * as React from 'react';
import { useSelector } from "react-redux";
import { Model } from '../../../redux/model/ModelTypes';
import { treeWalk } from '../../../redux/model/ModelTree';
import { PathFeature } from './PathFeature';
import { PointFeature } from './PointFeature';
import { RectangleFeature } from './RectangleFeature';
import { CircleFeature } from './CircleFeature';
import { visitFeature } from '../../../redux/model/ModelVisitors';

function renderFeature(feature: Model.Types.Feature) {
  return visitFeature({
    visitPoint: (point: Model.Types.Feature<Model.Types.Point>) => {
      return <PointFeature key={feature.id} feature={point} />;
    },
    visitRectangle: (rectangle: Model.Types.Feature<Model.Types.Rectangle>) => {
      return <RectangleFeature key={feature.id} feature={rectangle} />;
    },
    visitPath: (path: Model.Types.Feature<Model.Types.Path>) => {
      return <PathFeature key={feature.id} feature={path} />;
    },
    visitCircle: (circle: Model.Types.Feature<Model.Types.Circle>) => {
      return <CircleFeature key={feature.id} feature={circle} />;
    },
  }, feature);
}

export const Features = React.memo(function Features() {
  const model = useSelector(Model.Selectors.get);

  const renderedFeatures: React.ReactNode[] = [];
  treeWalk(model, (feature) => {
    renderedFeatures.push(renderFeature(feature));
  });

  return <g className='rendered-features'> {renderedFeatures} </g>;
});
