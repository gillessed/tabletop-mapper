import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/AppReducer';
import { FeatureToolbar } from '../featureToolbar/FeatureToolbar';
import { SvgRoot } from '../svg/SvgRoot';
import './CanvasContainer.scss';

interface State {
  dimensions?: {
    width: number;
    height: number;
  }
}

interface Props {
  state: ReduxState;
}

class CanvasContainerInternal extends React.Component<Props, State> {
  private containerDiv: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {}
  }

  public componentWillReceiveProps() {
    if (this.containerDiv) {
      setTimeout(() => {
        this.setState({
          dimensions: {
            width: this.containerDiv.clientWidth,
            height: this.containerDiv.clientHeight,
          },
        });
      });
    }
  }

  public render() {
    return (
      <div className='canvas-container' ref={this.setContainerRef}>
        {this.renderCanvasElement()}
        <FeatureToolbar />
      </div> 
    );
  }

  public componentDidMount() {
    window.addEventListener('resize', this.windowResizeListener);
  }

  private renderCanvasElement = () => {
    if (this.state.dimensions && this.containerDiv) {
      const { width, height } = this.state.dimensions;
      return (
        <SvgRoot width={width} height={height} />
      );
    }
  }

  private setContainerRef = (ref: HTMLDivElement) => {
    if (!this.containerDiv) {
      this.containerDiv = ref;
      this.setState({
        dimensions: {
          width: ref.clientWidth,
          height: ref.clientHeight,
        },
      });
    }
  }

  private windowResizeListener = () => {
    this.setState({
      dimensions: {
        width: this.containerDiv.clientWidth,
        height: this.containerDiv.clientHeight,
      },
    });
  }
}

const mapStateToProps = (state: ReduxState) => {
  return { state };
}

export const CanvasContainer = connect(mapStateToProps)(CanvasContainerInternal);