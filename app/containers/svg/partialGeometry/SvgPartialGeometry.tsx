import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../../redux/AppReducer';
import { Model } from '../../../redux/model/ModelTypes';

interface OwnProps {
  partialGeometry: Model.Types.Geometry;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export class SvgRectangleFeatureInternal extends React.PureComponent<Props> {
  public render() {
    const { partialGeometry } = this.props;
    switch (partialGeometry.type) {
      case 'rectangle':
        
    }
    const strokeWidth = 2 / transform.scale;
    return (
      <rect
        stroke='black'
        strokeWidth={strokeWidth}
        fill='none'
        x={geometry.p1.x}
        y={geometry.p1.y}
        width={geometry.p2.x - geometry.p1.x}
        height={geometry.p2.y - geometry.p1.y}
      />
    );
  }

  private renderRectangle() {

  }
}

const mapStateToProps = (state: ReduxState, props: OwnProps) => {
  return {

    transform: state.grid.transform,
  };
}

export const SvgRectangleFeature = connect(mapStateToProps)(SvgRectangleFeatureInternal);
