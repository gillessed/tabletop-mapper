import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/AppReducer';
import { FeatureToolbar } from '../featureToolbar/FeatureToolbar';
import { SvgRoot } from '../svg/SvgRoot';
import './CanvasContainer.scss';

export namespace CanvasContainer {
  export interface Props {

  }
}

export type Dimensions = { width: number, height: number } | undefined;

export const CanvasContainer = function CanvasContainer() {
  const container = React.useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = React.useState<Dimensions>();

  // const { width, height } = dimensions;
  let canvasElement = undefined;
  if (container != null && dimensions != undefined) {
    canvasElement = <SvgRoot width={dimensions.width} height={dimensions.height} />;
  }

  const updateDimensionsFromContainer = React.useCallback(() => {
    if (
      container != null &&
      (container.current.clientWidth != (dimensions?.width ?? 'NaN') || container.current.clientHeight != (dimensions?.height ?? 'NaN'))
    ) {
      setDimensions({
        width: container.current.clientWidth,
        height: container.current.clientHeight,
      });
    }
  }, [container, setDimensions]);

  React.useEffect(() => {
    updateDimensionsFromContainer();
    window.addEventListener('resize', updateDimensionsFromContainer);
    return () => {
      window.removeEventListener('resize', updateDimensionsFromContainer);
    }
  }, [updateDimensionsFromContainer, container]);

  return (
    <div className='canvas-container' ref={container}>
      {canvasElement}
      <FeatureToolbar />
    </div>
  );
}
