import * as React from 'react';
import { useSelector } from "react-redux";
import { treeWalk } from '../../../redux/model/ModelTree';
import { Model } from '../../../redux/model/ModelTypes';
import { Feature } from './Feature';

export const Features = function Features() {
  const features = useSelector(Model.Selectors.getFeatures);
  const layers = useSelector(Model.Selectors.getLayers);
  const styles = useSelector(Model.Selectors.getStyles);

  const renderedFeatures: JSX.Element[] = [];
  treeWalk(features, layers, (feature) => {
    const { styleId, geometry } = feature;
    const style = styles.byId[styleId];
    renderedFeatures.push(<Feature
      key={feature.id}
      geometry={geometry}
      style={style}
    />);
  });

  return <g className='rendered-features'> {renderedFeatures} </g>;
};
